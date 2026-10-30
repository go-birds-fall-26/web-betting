const fs = require('fs');
const path = require('path');
const pool = require('../pool');

const doReset = process.argv.includes('--reset');

async function runSeed() {
  try {
    const resetPath = path.join(__dirname, '../sql/reset.sql');
    const seedPath = path.join(__dirname, '../sql/seed.sql');

    const resetSql = fs.readFileSync(resetPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running seed script...');
    if (doReset) {
      console.log('Resetting database...');
      await pool.query(resetSql);
    }
    console.log('Initializing database...');
    await pool.query(seedSql);
    
    console.log('Seed script completed successfully.');
  } catch (error) {
    console.error('Error running seed script:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSeed();