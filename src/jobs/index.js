const cron = require('node-cron');
const { syncEvents } = require("./syncEvents");

// syncEvents is run at startup, then every five minutes
function startJobs() {
  async function runSync() {
    try {
      await syncEvents();
    } catch (error) {
      console.error("ESPN sync failed:", error);
    }
  }

  runSync();

  cron.schedule(
    process.env.ESPN_SYNC_CRON || "*/5 * * * *",
    runSync,
    { noOverlap: true }
  );
}

module.exports = { startJobs };