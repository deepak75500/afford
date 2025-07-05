
const db = req.app.get('db');

const stmt = db.prepare("INSERT INTO shorturls (url, shortcode, createdAt, expiry) VALUES (?, ?, ?, ?)");
stmt.run(url, shortcode, createdAtISO, expiryISO);

const sql = "SELECT * FROM shorturls WHERE shortcode = ?";
db.get(sql, [shortcode], (err, row) => {
  if (err) return res.status(500).json({ error: 'DB Error' });
  if (!row) return res.status(404).json({ error: 'Shortcode not found' });

});
const clickStmt = db.prepare("INSERT INTO clicks (shortcode, timestamp, referrer, location) VALUES (?, ?, ?, ?)");
clickStmt.run(shortcode, new Date().toISOString(), referrer, ip);

