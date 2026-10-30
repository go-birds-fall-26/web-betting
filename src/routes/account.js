const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('account', { title: 'Account' });
});

module.exports = router;