const express = require('express');
const router = express.Router();

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.post('/', (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!isValidURL(/^https?:\/\//.test(url) ? url : 'http://' + url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const db = req.app.get('db');
  const code = shortcode || generateShortCode();

  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + (validity || 30) * 60000);

  let finalUrl = url;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'http://' + finalUrl;
  }

  db.get("SELECT * FROM shorturls WHERE shortcode = ?", [code], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (row) return res.status(400).json({ error: 'Shortcode already taken' });

    db.run(
      "INSERT INTO shorturls (url, shortcode, createdAt, expiry) VALUES (?, ?, ?, ?)",
      [finalUrl, code, createdAt.toISOString(), expiry.toISOString()],
      function (err) {
        if (err) return res.status(500).json({ error: 'DB insert error' });
        res.status(201).json({ shortLink: `http://localhost:5000/${code}`, expiry: expiry.toISOString() });
      }
    );
  });
});

router.get('/:code', (req, res) => {
  const db = req.app.get('db');
  const code = req.params.code;

  db.get("SELECT * FROM shorturls WHERE shortcode = ?", [code], (err, shortUrl) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });
    if (new Date() > new Date(shortUrl.expiry)) return res.status(410).json({ error: 'Link expired' });

    console.log(`Redirecting to: ${shortUrl.url}`);

    db.run(
      "INSERT INTO clicks (shortcode, timestamp, referrer, location) VALUES (?, ?, ?, ?)",
      [
        code,
        new Date().toISOString(),
        req.headers.referer || 'unknown',
        req.ip
      ]
    );

    res.redirect(shortUrl.url);
  });
});

router.get('/stats/:code', (req, res) => {
  const db = req.app.get('db');
  const code = req.params.code;

  db.get("SELECT * FROM shorturls WHERE shortcode = ?", [code], (err, shortUrl) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });

    db.all("SELECT * FROM clicks WHERE shortcode = ?", [code], (err, clicks) => {
      if (err) return res.status(500).json({ error: 'DB clicks error' });

      res.json({
        originalUrl: shortUrl.url,
        createdAt: shortUrl.createdAt,
        expiry: shortUrl.expiry,
        totalClicks: clicks.length,
        clicks: clicks
      });
    });
  });
});

module.exports = router;
