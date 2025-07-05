const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../shortener.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to logs database', err);
  } else {
    console.log('Logger connected to SQLite');
  }
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stack TEXT,
    level TEXT,
    package TEXT,
    message TEXT,
    timestamp TEXT
  )`);
});

module.exports = (req, res, next) => {
  const logMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      stack: 'backend',
      level,
      package: 'middleware',
      message,
      timestamp
    };

    console.log(JSON.stringify(logEntry));
    db.run(
      `INSERT INTO logs (stack, level, package, message, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [logEntry.stack, logEntry.level, logEntry.package, logEntry.message, logEntry.timestamp],
      (err) => {
        if (err) console.error("Failed to store log in DB", err);
      }
    );
  };

  logMessage("info", `Incoming ${req.method} request to ${req.originalUrl}`);

  res.on("finish", () => {
    if (res.statusCode >= 400) {
      logMessage("error", `Error ${res.statusCode} for ${req.method} ${req.originalUrl}`);
    }
  });

  next();
};
