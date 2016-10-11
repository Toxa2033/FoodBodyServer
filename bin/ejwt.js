var expressJwt = require('express-jwt');
var config = require('../config/index');

var options = {
    secret: config.get('token:secret'),
    getToken: function (req) {
        if (req.query && req.query.token){
            return req.query.token;
        }
        return null;
    }
};

module.exports = expressJwt(options);