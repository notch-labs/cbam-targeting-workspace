require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      ok: true,
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.get('/api/organisations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM organisations
      ORDER BY organisation_name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load organisations',
    });
  }
});

app.get('/api/organisations/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM organisations
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Organisation not found',
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load organisation',
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});