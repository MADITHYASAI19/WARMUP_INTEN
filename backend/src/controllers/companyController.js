const express = require('express');
const router = express.Router();
const { pool } = require('../services/db');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');

// Simple auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Create or Update company profile
router.post('/register', auth, [
  body('company_name').notEmpty(),
  body('city').notEmpty(),
  body('state').notEmpty(),
  body('country').notEmpty(),
  body('industry').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const uid = req.user.user_id;
  const {
    company_name, address='', city, state, country, postal_code='', website='', industry, logo_url=null
  } = req.body;
  try {
    // upsert pattern
    const exists = await pool.query('SELECT id FROM company_profile WHERE owner_id=$1', [uid]);
    if (exists.rowCount === 0) {
      const result = await pool.query(
        `INSERT INTO company_profile(owner_id, company_name, address, city, state, country, postal_code, website, industry, logo_url)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
         [uid, sanitizeHtml(company_name), sanitizeHtml(address), city, state, country, postal_code, website, industry, logo_url]
      );
      return res.json({ success: true, id: result.rows[0].id });
    } else {
      await pool.query(
        `UPDATE company_profile SET company_name=$1, address=$2, city=$3, state=$4, country=$5, postal_code=$6, website=$7, industry=$8, logo_url=$9, updated_at=NOW()
         WHERE owner_id=$10`,
        [sanitizeHtml(company_name), sanitizeHtml(address), city, state, country, postal_code, website, industry, logo_url, uid]
      );
      return res.json({ success: true, message: 'Updated' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile', auth, async (req, res) => {
  const uid = req.user.user_id;
  try {
    const result = await pool.query('SELECT * FROM company_profile WHERE owner_id=$1', [uid]);
    if (result.rowCount === 0) return res.json({ success: true, data: null });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
