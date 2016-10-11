var router = require('express').Router();
const PC = require('../bin/mongoose').model('Pc');
const User = require('../bin/mongoose').model('User');
//var jwt = require('jsonwebtoken');
var config = require('../config/index');

router.post('/', function(req, res, next) {
    var user = new User(req.body);
    var pc= new PC({
       pcName:req.body.pcName
    });
    User.authorize(user,pc, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

router.post('/register', function(req, res, next) {
    var user = new User(req.body);
    var pc= new PC({
        pcName:req.body.pcName
    });
    User.register(user,pc, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

module.exports = router;