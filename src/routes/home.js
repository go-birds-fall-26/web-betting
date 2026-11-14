const router = require('express').Router();

const PLACEHOLDER_WEEKS = [
  {
    name: 'Week 9',
    games: [
      {
        date: new Date('2024-10-01T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 55, color: '#2ea6e2' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 45, color: '#c72c41' },
      },
      {
        date: new Date('2024-10-02T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 10, color: '#1e601c' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 90, color: '#f0a717' },
      },
      {
        date: new Date('2024-10-03T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 35, color: '#8e0f20' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 65, color: '#156868' },
      },
            {
        date: new Date('2024-10-01T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 55, color: '#2ea6e2' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 45, color: '#c72c41' },
      },
      {
        date: new Date('2024-10-02T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 10, color: '#1e601c' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 90, color: '#f0a717' },
      },
      {
        date: new Date('2024-10-03T19:00:00Z'),
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3, chance: 35, color: '#8e0f20' },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2, chance: 65, color: '#156868' },
      },
    ],
  },
];

const gameTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatGameTime(date) {
  return gameTimeFormat.format(date).replace(',', ' @');
}

function withTimeLabels(weeks) {
  return weeks.map((week) => ({
    ...week,
    games: week.games.map((game) => ({ ...game, timeLabel: formatGameTime(game.date) })),
  }));
}

router.get('/', (req, res) => {
  res.render('home', { title: 'Home', weeks: withTimeLabels(PLACEHOLDER_WEEKS) });
});

module.exports = router;
