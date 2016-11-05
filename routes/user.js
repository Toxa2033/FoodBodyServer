const router = require('express').Router();
const User = require('../bin/mongoose').model('User');
const async = require('async');
const Post = require('../bin/mongoose').model('Post');


/* GET users listing. */

router.get('/', function(req, res, next) {
    var query = req.search.mongooseQuery || {};
    User.find(query, function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

/*router.post('/', function(req, res, next) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) return next(err);
        res.json(user);
    })
});*/

router.get('/:id', function(req, res, next) {
    var currentUser = req.user;
    User.findById(req.params.id)
        .lean()
        .exec(function(err, user){
            if (err) return next(err);
            /*
            var follower = user.follow.filter(function (id) {
               return id.toString() == currentUser.toString();
            });
            var follow = user.followers.filter(function (id) {
               return id.toString() == currentUser.toString();
            });
            user.isFollower = follower[0] == currentUser;
            user.isFollow = follow[0] == currentUser;*/
            res.json(user);
        });

});

router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user){
        if (err) return next(err);
        res.json(user);
    })
});

router.delete('/:id', function(req, res, next) {
    User.remove({_id: req.params.id}, function (err, user){
        if (err) return next(err);
        res.json(user);
    })
});

module.exports = router;
