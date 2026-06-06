require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('CONNECTED');
    console.log(result.rows[0]);
  } catch (error) {
    console.error('FAILED');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

test();