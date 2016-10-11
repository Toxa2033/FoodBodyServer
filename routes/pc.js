const router = require('express').Router();
const User = require('../bin/mongoose').model('User');
const async = require('async');
const PC = require('../bin/mongoose').model('Pc');
const Process = require('../bin/mongoose').model('Process');
const www = require('../bin/www');

/* GET users listing. */

router.get('/', function(req, res, next) {
    var query;
    var user=req.query.user;
    var machineId=req.query.machineId;
    if(user&&machineId){
        query={owner:user, machineId:machineId};
    } else if(machineId){
        query={machineId:machineId};
    } else if(user){
        query = {owner:user};
    }
    PC.find(query)
        .lean()
        .populate('owner')
        .exec(function (err, pcs) {
            if (err) return next(err);
            res.json(pcs);
        });
});

router.post('/', function(req, res, next) {
    delete req.body._id;
    req.body.owner=req.body.owner._id;
    PC.find({machineId:req.body.machineId, owner:req.body.owner},function(err,result){
        if(err)next(err);
        if(result.length==0) {
            var pc = new PC();
            pc.startedProcess=req.body.startedProcess;
            pc.pcName=req.body.pcName;
            pc.machineId=req.body.machineId;
            pc.owner=req.body.owner;
            pc.installSoftware=req.body.installSoftware;
            pc.save(function (err, pc) {
                if (err) return next(err);
                    PC.findOne({machineId:req.body.machineId, owner:req.body.owner})
                        .populate('owner')
                        .exec(function(err,callback){
                        if(err)next(err);
                        if(callback) {
                        www.socket.sockets.emit(callback.owner._id,{type:'add_pc',pc:callback._id,user:callback.owner._id});
                        res.json(callback);
                    } else {
                        res.json({status:'', code:204});
                    }
                    });

            });
        } else{
            var ObjectId = require('mongoose').Types.ObjectId;
            var id = new ObjectId(result[0]._id);
            var query = {_id: id};
            PC.findOneAndUpdate(query, req.body, {new:true,upsert: true}, function (err, pc){
                if (err) return next(err);
                if(pc) {
                    PC.populate(pc,'owner',function(err,result){
                        if(err)next(err);
                       res.json(result);
                    });
                }else {
                    res.json({status:'', code:204});
                }
            })
        }
    });

 });

router.get('/:id', function(req, res, next) {
    PC.findOne({machineId:req.params.id, owner:req.query.user})
        .lean()
        .populate('owner')
        .exec(function (err, pcs) {
            if (err) return next(err);
            res.json(pcs);
        });
});



router.put('/:id', function(req, res, next) {
    PC.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, pc){
        if (err)  next(err);
        PC.populate(pc,'owner',function(err,result){
            if(err)next(err);
            res.json(result);
        });
    })
});

router.delete('/:id', function(req, res, next) {
    PC.remove({_id: req.params.id}, function (err, pc){
        if (err) return next(err);
        if(pc) {
            res.json({status: "OK", code: 200});
        } else{
            res.json({status:'', code:204});
        }
    })
});

module.exports = router;
