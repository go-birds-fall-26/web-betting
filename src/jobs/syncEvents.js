// INTENDED FUNCTIONALITY:
// calls the EPSN API every 5 minutes for event information of the current week, the next week, and the week after that
// syncs the ESPN API event information with the events database

// ideally, we want to check if a game is finished when a user places a bet, meaning we sync the database at that time as well.
// right now this function will just sync every 5 minutes

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
    
    const weeks = [];

    // build a list of up to 3 weeks, the approach is done this way to handle when lastWeek is 18
    for (let week = currentWeek; week <= lastWeek; week++) {
        weeks.push(week);
    }

    const scoreboards = [currentScoreboard];

    // scoreboards will contain an array of up to 3 weeks of events
    for (const week of weeks) {
        if (week === currentWeek) { // skip current week
            continue;
        }

        const scoreboard = await getScoreboard(week);
        scoreboards.push(scoreboard);
    }
}