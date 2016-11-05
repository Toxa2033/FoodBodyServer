var jwt = require('../bin/ejwt');

module.exports = function (app) {
        app.use(jwt.unless({
            path: [
                '/authorization',
                '/authorization/register'
            ]
        }));
    app.use('/', require('./index'));
    app.use('/authorization', require('./authorization'));
    app.use('/pc', require('./pc'));
    app.use('/tasks', require('./task'));
    /*  app.use('/responses', require('./response'));
   app.use('/posts', require('./post'));
    app.use('/report', require('./report'));
    //app.use('/upload', require('./upload'));
    app.use('/users', require('./user'));
    app.use('/relation', require('./relation'));*/
};