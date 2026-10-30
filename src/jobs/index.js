const cron = require('node-cron');

function startJobs() {
  // PLACEHOLDER TEST JOB it logs the time every minute by default
  cron.schedule(process.env.DEFAULT_CRON || '* * * * *', () => {
    console.log('[cron] ding dong', new Date().toISOString());
  });
}

module.exports = { startJobs };