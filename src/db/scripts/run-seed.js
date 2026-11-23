const fs = require("fs");
const path = require("path");
const pool = require("../pool");
const { getUpcomingEvents } = require("../../services/events");
const { createHomeWinMarket } = require("../../services/markets");

const doReset = process.argv.includes("--reset");

async function runSeed() {
  try {
    const resetPath = path.join(__dirname, "../sql/reset.sql");
    const seedPath = path.join(__dirname, "../sql/seed.sql");

    const resetSql = fs.readFileSync(resetPath, "utf8");
    const seedSql = fs.readFileSync(seedPath, "utf8");

    console.log("Running seed script...");
    if (doReset) {
      console.log("Resetting database...");
      await pool.query(resetSql);
    }
    console.log("Initializing database...");
    await pool.query(seedSql);

    // Temporary until we can load upcoming games, then a worker will run this after games have been loaded in
    let events = await getUpcomingEvents();
    for (let event of events) {
      await createHomeWinMarket(event.id);
    }

    console.log("Seed script completed successfully.");
  } catch (error) {
    console.error("Error running seed script:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSeed();
