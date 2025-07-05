const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortUrlRoutes = require('./routes/shorturl');
const loggerMiddleware = require('./middleware/logger');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);
const db = new sqlite3.Database('./shortener.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    alert(err);
  } else {
    console.log('Connected to SQLite database');
  }
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS shorturls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    shortcode TEXT UNIQUE,
    createdAt TEXT,
    expiry TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shortcode TEXT,
    timestamp TEXT,
    referrer TEXT,
    location TEXT
  )`);
});
app.set('db', db);
app.use('/shorturls', shortUrlRoutes); 
app.use('/', shortUrlRoutes);        
app.get('/', (req, res) => res.send('URL Shortener Backend Running'));
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
