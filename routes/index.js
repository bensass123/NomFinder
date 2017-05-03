var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/',stormpath.loginRequired, function(req, res, next) {
    if (req.user.customData.group === 'user') {
        res.sendFile(path.join(__dirname, '/../views/index.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '/../views/indexAdmin.html'));
    }
});


module.exports = router;
