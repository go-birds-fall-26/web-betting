const router = require('express').Router();
const { getUpcomingWeeks } = require('../services/games');

router.get('/', async (req, res) => {
  try {
    let weeks = await getUpcomingWeeks();
    res.render('home', { title: 'Home', weeks });
  } catch (error) {
    console.error('Failed to load home page:', error);
    res.status(500).send('Could not load home page');
  }
});

module.exports = router;
