const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const logDir = path.join(__dirname, "logs");
const logFile = path.join(logDir, "ip_log.txt");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const now = new Date().toISOString();
  const logEntry = `[${now}] IP: ${ip}\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Error:", err);
  });
  next();
});
app.use(express.static("."));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
