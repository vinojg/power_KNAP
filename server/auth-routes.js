const router = require('express').Router();
const passport = require('passport');

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('user').redirect('/');
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile'], // put other things in here you may want from google (check API)
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.cookie('user', req.user.displayName).redirect('/');
});

module.exports = router;
