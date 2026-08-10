const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve frontend files

// Postgres connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test DB connection
pool.connect((err) => {
  if (err) {
    console.error('DB connection error:', err.stack);
  } else {
    console.log('✅ Postgres DB connected successfully');
  }
});

// Create customers table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    destination VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`, (err) => {
  if (err) {
    console.error('Table creation error:', err);
  } else {
    console.log('✅ Customers table ready');
  }
});

// API Routes
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, email, phone, destination, message } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, destination, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, destination, message]
    );
    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // Duplicate email
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Serve frontend
app.use((req, res) => {
  res.status(404).send("Page not found");
});
// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log('API endpoints: POST /api/customers, GET /api/customers');
});

