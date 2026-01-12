const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/access-logs.db');
const DB_DIR = path.dirname(DB_PATH);

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip TEXT NOT NULL,
      country TEXT,
      city TEXT,
      region TEXT,
      latitude REAL,
      longitude REAL,
      timezone TEXT,
      userAgent TEXT,
      referer TEXT,
      action TEXT,
      section TEXT,
      email TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_timestamp ON access_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_country ON access_logs(country);
    CREATE INDEX IF NOT EXISTS idx_city ON access_logs(city);
    CREATE INDEX IF NOT EXISTS idx_action ON access_logs(action);
  `);
};

const insertLog = (logData) => {
  const stmt = db.prepare(`
    INSERT INTO access_logs (ip, country, city, region, latitude, longitude, timezone, userAgent, referer, action, section, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    logData.ip,
    logData.country,
    logData.city,
    logData.region,
    logData.latitude,
    logData.longitude,
    logData.timezone,
    logData.userAgent,
    logData.referer,
    logData.action,
    logData.section,
    logData.email
  );
};

const getAllLogs = (limit = 1000) => {
  const stmt = db.prepare(`
    SELECT * FROM access_logs
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  
  return stmt.all(limit);
};

const getLogsByDateRange = (startDate, endDate, limit = 1000) => {
  const stmt = db.prepare(`
    SELECT * FROM access_logs
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  
  return stmt.all(startDate, endDate, limit);
};

const getHeatmapData = () => {
  const stmt = db.prepare(`
    SELECT 
      country,
      city,
      latitude,
      longitude,
      COUNT(*) as count
    FROM access_logs
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    GROUP BY country, city, latitude, longitude
    ORDER BY count DESC
  `);
  
  return stmt.all();
};

const getStats = () => {
  const totalVisits = db.prepare('SELECT COUNT(*) as count FROM access_logs').get();
  const uniqueIPs = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM access_logs').get();
  const countriesCount = db.prepare('SELECT COUNT(DISTINCT country) as count FROM access_logs WHERE country IS NOT NULL').get();
  const citiesCount = db.prepare('SELECT COUNT(DISTINCT city) as count FROM access_logs WHERE city IS NOT NULL').get();
  
  const topCountries = db.prepare(`
    SELECT country, COUNT(*) as count
    FROM access_logs
    WHERE country IS NOT NULL
    GROUP BY country
    ORDER BY count DESC
    LIMIT 10
  `).all();
  
  const topCities = db.prepare(`
    SELECT city, country, COUNT(*) as count
    FROM access_logs
    WHERE city IS NOT NULL
    GROUP BY city, country
    ORDER BY count DESC
    LIMIT 10
  `).all();
  
  const recentLogs = db.prepare(`
    SELECT * FROM access_logs
    ORDER BY timestamp DESC
    LIMIT 20
  `).all();
  
  return {
    totalVisits: totalVisits.count,
    uniqueIPs: uniqueIPs.count,
    countriesCount: countriesCount.count,
    citiesCount: citiesCount.count,
    topCountries,
    topCities,
    recentLogs
  };
};

module.exports = {
  initDB,
  insertLog,
  getAllLogs,
  getLogsByDateRange,
  getHeatmapData,
  getStats
};
