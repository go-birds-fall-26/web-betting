// INTENDED FUNCTIONALITY:
// calls the EPSN API every 5 minutes for event information of the current week, the next week, and the week after that
// syncs the ESPN API event information with the events database

// ideally, we want to check if a game is finished when a user places a bet, meaning we sync the database at that time as well.
// right now this function will just sync every 5 minutes

async function syncEvents() {
    // import function that calls ESPN API
    const { getScoreboard } = require("../services/espn");
    // import function that updates DB
    const { upsertEvent } = require("../services/events");

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


    // loop through every scoreboard to find the events for a given week, then loop through
    // every event/game to extract the relevant values. then upsert into the events DB
    for (const scoreboard of scoreboards) {
        for (const game of scoreboard.events) {
            const competition = game.competitions[0];

            const homeTeam = competition.competitors.find(
                team => team.homeAway === "home"
            );

            const awayTeam = competition.competitors.find(
                team => team.homeAway === "away"
            );

            const espnStatus = competition.status.type;
            let status;

            if (espnStatus.name === "STATUS_SCHEDULED") {
                status = "scheduled";
            } else if (espnStatus.state === "in") {
                status = "in_progress";
            } else if (
                espnStatus.name === "STATUS_FINAL" &&
                espnStatus.completed === true
            ) {
                status = "final";
            } else {
                throw new Error(`Unsupported ESPN status: ${espnStatus.name}`);
            }

            const winner = status === "final"
                ? competition.competitors.find(team => team.winner === true)
                : null;

            // upsert into events DB
            await upsertEvent({
                espn_game_id: game.id,
                season_type: scoreboard.season.type,
                week: scoreboard.week.number,
                home_team_id: homeTeam.team.id,
                away_team_id: awayTeam.team.id,
                start_time: game.date,
                status: status,
                home_score: homeTeam.score == null || homeTeam.score === ""
                    ? null : Number(homeTeam.score),
                away_score: awayTeam.score == null || awayTeam.score === ""
                    ? null : Number(awayTeam.score),
                winner_team_id: winner ? winner.team.id : null
            });
        }
    }

}

module.exports = { syncEvents };