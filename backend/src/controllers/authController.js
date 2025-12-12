const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../services/db');

/*
  NOTE: This controller implements email/password registration and login.
  Firebase OTP/email verification is only scaffolded here: the frontend should use Firebase SDK
  to send OTP and verify email, then call the backend to mark verification flags if needed.
*/

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
  body('mobile_no').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, full_name, gender='o', mobile_no, signup_type='e' } = req.body;
  try {
    const cleanName = sanitizeHtml(full_name);
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(email, password, full_name, gender, mobile_no, signup_type, is_mobile_verified, is_email_verified) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [email, hashed, cleanName, gender, mobile_no, signup_type, false, false]
    );
    const userId = result.rows[0].id;
    return res.json({ success: true, message: 'User registered (verify mobile/email separately)', data: { user_id: userId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login (email/password)
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: `${(process.env.JWT_EXPIRES_DAYS||90)*24}h` });
    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// NOTE: endpoints to mark email/mobile as verified can be added; front-end will use Firebase SDK to send OTP/email links.

module.exports = router;
