const { getUpcomingEvents } = require("./events");
const { getYesPriceCents, getNoPriceCents } = require("./pricing");
const { formatGameTime } = require("../utils/gameTime");

// ESPN mapping for playoff weeks
const PLAYOFF_NAMES = {
    1: "Wild Card",
    2: "Divisional Round",
    3: "Conference Championship",
    5: "Super Bowl",
};

function getWeekName(event) {
    if (event.season_type === 3) {
        return PLAYOFF_NAMES[event.week] ?? "Playoffs";
    }

    return `Week ${event.week}`;
}

function toTeam(event, side, chance) {
    return {
        id: event[`${side}_team_id`],
        name: `${event[`${side}_location`]} ${event[`${side}_name`]}`,
        abbreviation: event[`${side}_abbreviation`],
        logo: event[`${side}_logo`],
        color: `#${event[`${side}_color`]}`,
        chance,
    };
}

function toGame(event) {
    // TODO: no default markets exist yet
    // once they do, swap the zeros for the market's yes_count and no_count
    let homeChance = getYesPriceCents(0, 0);
    let awayChance = getNoPriceCents(0, 0);

    return {
        id: event.id,
        timeLabel: formatGameTime(event.start_time),
        away: toTeam(event, "away", awayChance),
        home: toTeam(event, "home", homeChance),
    };
}

// returns weeks in shape [{ id, name, games }]
async function getUpcomingWeeks() {
    let events = await getUpcomingEvents();
    let weeks = new Map();

    for (let event of events) {
        let id = `week-${event.season_type}-${event.week}`;

        if (!weeks.has(id)) {
            weeks.set(id, { id, name: getWeekName(event), games: [] });
        }

        weeks.get(id).games.push(toGame(event));
    }

    return [...weeks.values()];
}

module.exports = { getUpcomingWeeks };
