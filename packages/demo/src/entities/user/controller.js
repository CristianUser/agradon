const { verifyAuth } = require('@agradon/auth');

module.exports = router => {
  router.get('/me', verifyAuth(), (req, res) => {
    res.send(req.user);
  });
};
