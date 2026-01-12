require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initDB, insertLog, getAllLogs, getLogsByDateRange, getHeatmapData, getStats } = require('./utils/db');
const { verifyToken, generateToken } = require('./utils/jwt');
const { getGeoInfo } = require('./utils/geoip');
const { logAccess, logError } = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://hirotoshi-uchida.vercel.app';

// Initialize Database
initDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP'
});
app.use('/track', limiter);

// WebSocket Broadcasting
const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket Connection
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (err) {
      logError('WebSocket message error', err);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (err) => {
    logError('WebSocket error', err);
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tracking Endpoint
app.get('/track', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';
    const referer = req.headers['referer'] || req.headers['referrer'] || 'direct';
    const action = req.query.action || 'pageview';
    const section = req.query.section || '';
    const email = req.query.email || '';
    
    const geoInfo = getGeoInfo(ip);
    
    const logData = {
      ip,
      country: geoInfo.country,
      city: geoInfo.city,
      region: geoInfo.region,
      latitude: geoInfo.latitude,
      longitude: geoInfo.longitude,
      timezone: geoInfo.timezone,
      userAgent,
      referer,
      action,
      section,
      email
    };
    
    insertLog(logData);
    logAccess(logData);
    
    // Broadcast to WebSocket clients
    broadcast({
      type: 'newLog',
      data: {
        ...logData,
        timestamp: new Date().toISOString()
      }
    });
    
    // Return 1x1 transparent GIF
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': gif.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(gif);
  } catch (err) {
    logError('Tracking error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === validUsername && password === validPassword) {
      const token = generateToken({ username });
      res.json({ 
        success: true, 
        token,
        expiresIn: '24h'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
  } catch (err) {
    logError('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected Routes Middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    logError('Auth middleware error', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Get All Logs (Protected)
app.get('/api/logs', authMiddleware, (req, res) => {
  try {
    const { startDate, endDate, limit = 1000 } = req.query;
    
    let logs;
    if (startDate && endDate) {
      logs = getLogsByDateRange(startDate, endDate, parseInt(limit));
    } else {
      logs = getAllLogs(parseInt(limit));
    }
    
    res.json({ success: true, logs });
  } catch (err) {
    logError('Get logs error', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get Heatmap Data (Protected)
app.get('/api/heatmap', authMiddleware, (req, res) => {
  try {
    const heatmapData = getHeatmapData();
    res.json({ success: true, data: heatmapData });
  } catch (err) {
    logError('Heatmap error', err);
    res.status(500).json({ error: 'Failed to generate heatmap' });
  }
});

// Get Statistics (Protected)
app.get('/api/stats', authMiddleware, (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, stats });
  } catch (err) {
    logError('Stats error', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Export CSV (Protected)
app.get('/api/export/csv', authMiddleware, (req, res) => {
  try {
    const { stringify } = require('csv-stringify/sync');
    const logs = getAllLogs(100000);
    
    const csv = stringify(logs, {
      header: true,
      columns: ['id', 'timestamp', 'ip', 'country', 'city', 'region', 'latitude', 'longitude', 'userAgent', 'referer', 'action', 'section']
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=access-logs.csv');
    res.send(csv);
  } catch (err) {
    logError('CSV export error', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Export JSON (Protected)
app.get('/api/export/json', authMiddleware, (req, res) => {
  try {
    const logs = getAllLogs(100000);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=access-logs.json');
    res.json(logs);
  } catch (err) {
    logError('JSON export error', err);
    res.status(500).json({ error: 'Failed to export JSON' });
  }
});

// Serve Admin (Next.js)
app.use('/admin', express.static(path.join(__dirname, 'admin/.next/standalone')));
app.use('/admin/_next', express.static(path.join(__dirname, 'admin/.next/static')));

// Serve Viewer (Nuxt.js)
app.use('/viewer', express.static(path.join(__dirname, 'viewer/.output/public')));

// Privacy Policy
app.get('/privacy', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Hirotoshi Uchida</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p class="mb-4"><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">1. Information We Collect</h2>
    <p class="mb-4">We collect the following information when you visit our website:</p>
    <ul class="list-disc ml-6 mb-4">
      <li>IP address</li>
      <li>Geographic location (country, city)</li>
      <li>Browser user agent</li>
      <li>Referrer URL</li>
      <li>Page interactions (clicks, scrolls)</li>
      <li>Timestamp of access</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">2. How We Use Your Information</h2>
    <p class="mb-4">We use this information for:</p>
    <ul class="list-disc ml-6 mb-4">
      <li>Analytics and website improvement</li>
      <li>Security monitoring</li>
      <li>Understanding user behavior</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">3. Data Retention</h2>
    <p class="mb-4">Access logs are stored permanently for analytical purposes. We do not sell or share your data with third parties.</p>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">4. Your Rights (GDPR Compliance)</h2>
    <p class="mb-4">You have the right to:</p>
    <ul class="list-disc ml-6 mb-4">
      <li>Request access to your data</li>
      <li>Request deletion of your data</li>
      <li>Object to data processing</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">5. Cookies</h2>
    <p class="mb-4">We use essential cookies for authentication. No tracking cookies are used without consent.</p>
    
    <h2 class="text-2xl font-bold mt-6 mb-3">6. Contact</h2>
    <p class="mb-4">For privacy inquiries, please contact via the <a href="${FRONTEND_URL}#contact" class="text-blue-600 underline">contact form</a>.</p>
  </div>
</body>
</html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  logError('Server error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
