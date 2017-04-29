var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/',stormpath.loginRequired, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
