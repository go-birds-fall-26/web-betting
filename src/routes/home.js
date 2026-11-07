const router = require('express').Router();

const PLACEHOLDER_GAMES_GROUPS = [
  {
    group: 'Week 9',
    games: [
      {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-01T19:00:00Z'),
        volume: 58210,
        markets: [
          { question: 'Away Team', yes: 55, color: '#2ea6e2' },
          { question: 'Home Team', yes: 45, color: '#c72c41' }
        ]
      },
      {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-02T19:00:00Z'),
        
        markets: [
          { question: 'Away Team', yes: 10, color: '#1e601c' },
          { question: 'Home Team', yes: 90, color: '#f0a717' }
        ]
      },
      {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-03T19:00:00Z'),
        markets: [
          { question: 'Away Team', yes: 55, color: '#2ea6e2' },
          { question: 'Home Team', yes: 45, color: '#c72c41' }
        ]
      },
            {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-05T19:00:00Z'),
        markets: [
          { question: 'Away Team', yes: 35, color: '#8e0f20' },
          { question: 'Home Team', yes: 65, color: '#156868' }
        ]
      },
      {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-05T19:00:00Z'),
        markets: [
          { question: 'Away Team', yes: 55, color: '#1c7448' },
          { question: 'Home Team', yes: 45, color: '#c34907' }
        ]
      },
      {
        away: { name: 'Away Team', abbreviation: 'AWAY', wins: 5, losses: 3 },
        home: { name: 'Home Team', abbreviation: 'HOME', wins: 6, losses: 2 },
        date: new Date('2024-10-07T19:00:00Z'),
        markets: [
          { question: 'Away Team', yes: 55, color: '#2ea6e2' },
          { question: 'Home Team', yes: 45, color: '#c72c41' }
        ]
      }
    ]
  }
]

router.get('/', (req, res) => {
  res.render('home', { title: 'Home', gamesGroups: PLACEHOLDER_GAMES_GROUPS });
});

module.exports = router;