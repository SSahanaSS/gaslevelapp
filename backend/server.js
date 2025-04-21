const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'my_super_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection (replace with your credentials)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gas_monitoring',
  password: 'Soup@2004', // Replace with your actual DB password
  port: 5432,
});

// Store the tokens (in a real app, store in a DB or Redis)
let savedPushTokens = [];

// ✅ Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.email = decoded.email;
    next();
  });
}

// ✅ SIGNUP Route
app.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, phno, password) VALUES ($1, $2, $3, $4)',
      [name, email, phone, hashedPassword]
    );

    res.status(200).json({ message: 'Sign up successful' });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Signup failed' });
    }
  }
});

// ✅ LOGIN Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ Save Push Token
app.post('/save-token', (req, res) => {
  const { token } = req.body;

  if (token && !savedPushTokens.includes(token)) {
    savedPushTokens.push(token);
    console.log("Token saved:", token);
  }

  res.sendStatus(200);
});

// ✅ GET Most Recent Gas Level
app.get("/gas-level", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT gaslevel FROM gas_readings ORDER BY readingtime DESC LIMIT 1"
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the most recent gas level
    } else {
      res.json({ gaslevel: null }); // Handle empty table case
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// // ✅ Dummy Gas Level Route (protected)
// app.get('/gas-level', verifyToken, (req, res) => {
//   const mockLevel = Math.floor(Math.random() * 100);
//   res.json({ level: mockLevel });
// });

// ✅ Send Gas Level Warning Notification
app.post('/send-gas-warning', async (req, res) => {
  const message = {
    to: savedPushTokens,
    sound: 'default',
    title: '⚠️ Gas Alert',
    body: 'Gas level is below 20%. Refill immediately!',
    data: { type: 'GAS_LOW' },
    actions: [
      { identifier: 'accept', buttonTitle: 'Accept' },
      { identifier: 'ignore', buttonTitle: 'Ignore' }
    ]
  };

  try {
    await axios.post('https://exp.host/--/api/v2/push/send', message);
    res.send("Push notification sent.");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Failed to send push notification.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
