const router = require('express').Router();

router.get('/:id', (req, res) => {
  res.render('bets', 
    { 
      title: `Bet ${req.params.id}`,
      betId: req.params.id
    }
  );
});

module.exports = router;