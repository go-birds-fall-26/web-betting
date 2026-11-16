async function syncEvents() {
    // import function that calls ESPN API
    const { getScoreboard } = require("../services/espn");

    const currentScoreboard = await getScoreboard();

    // only sync the regular season
    if (currentScoreboard.season.type !== 2) {
        return;
    }

    // the job will sync NFL events for the current week and the following two weeks
    const currentWeek = currentScoreboard.week.number;
    const lastWeek = Math.min(currentWeek + 2, 18); // hardcoded check that we don't request a week value above 18 (number of regular season weeks)
    const nextWeek = lastWeek - 1;

    const nextScoreboard = await getScoreboard(nextWeek);
    const lastScoreboard = await getScoreboard(lastWeek);
}