const router = require('express').Router();

router.use('/', require('./home'));
router.use('/bets', require('./bets'));
router.use('/account', require('./account'));
router.use('/', require('./auth'));

module.exports = router;