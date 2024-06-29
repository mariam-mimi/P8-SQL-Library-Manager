var express = require('express');
var router = express.Router();

/* GETS users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
