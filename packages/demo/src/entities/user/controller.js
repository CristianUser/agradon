const { verifyAuth } = require('@agradon/core');

module.exports = router => {
  router.get('/me', verifyAuth(), (req, res) => {
    res.send(req.user);
  });
};
