var router = require('express').Router();
const PC = require('../bin/mongoose').model('Pc');
const User = require('../bin/mongoose').model('User');
//var jwt = require('jsonwebtoken');
var config = require('../config/index');
var jwt = require('jsonwebtoken');

router.post('/', function(req, res, next) {
    var user = new User(req.body);
    var pc= new PC({
       pcName:req.body.pcName
    });
    User.authorize(user,pc, function (err, user) {
        processAuth(res,err,next,user);
    });
});

router.post('/register', function(req, res, next) {
    var user = new User(req.body);
    var pc= new PC({
        pcName:req.body.pcName
    });
    User.register(user,pc, function (err, user) {
        processAuth(res,err,next,user);
    });
});


function processAuth(res,err,next,user){
    if (err) return next(err);
    var token = jwt.sign({id: user._id.toString()}, config.get('token:secret'));
    var body={};
    body._id=user._id;
    body.login=user.login;
    body.password=user.password;
    body.email=user.email;
    body.token=token;
    res.json(body)
}

module.exports = router;