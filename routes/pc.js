const router = require('express').Router();
const User = require('../bin/mongoose').model('User');
const async = require('async');
const PC = require('../bin/mongoose').model('Pc');
const Process = require('../bin/mongoose').model('Process');
const www = require('../bin/www');
const pcUtils=require('../utils/pcUtils');
/* GET users listing. */

router.get('/', function(req, res, next) {
    var query;
    var tokenUser=req.user.id;
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
            pcUtils.processPC(pcs,tokenUser,function(arrayPc){
                res.json(arrayPc);
            })

        });
});

router.post('/', function(req, res, next) {
    delete req.body._id;
    var user=req.body.owner._id || req.user.id;
    PC.find({machineId:req.body.machineId},function(err,result){
        if(err)next(err);
        if(result.length==0) {
            var pc = new PC();
            pc.startedProcess=req.body.startedProcess;
            pc.pcName=req.body.pcName;
            pc.machineId=req.body.machineId;
            pc.owner=[user];
            pc.installSoftware=req.body.installSoftware;
            pc.save(function (err, pc) {
                if (err) return next(err);
                    PC.findOne({machineId:req.body.machineId})
                        .populate('owner')
                        .lean()
                        .exec(function(err,callback){
                        if(err)next(err);
                        if(callback) {
                            callback.owner=pcUtils.getUserFromUserArray(callback.owner,user);
                                www.socket.sockets.emit(callback.owner._id,{type:'add_pc',pc:callback._id,user:user});
                            res.json(callback);
                    } else {
                        res.json({status:'', code:204});
                    }
                    });

            });
        } else{
            var query = {_id: result[0]._id};
            var owners =result[0].owner;
            if(owners.indexOf(user)==-1) {
                owners.push(user);
            }
            req.body.owner=owners;
            PC.findOneAndUpdate(query, req.body, {new:true,upsert: true}, function (err, pc){
                if (err) return next(err);
                if(pc) {
                    PC.populate(pc,'owner',function(err,result){
                        if(err)next(err);
                           var pc=result.toObject();
                            pc.owner=pcUtils.getUserFromUserArray(result.owner,user);
                            res.json(pc);
                    });
                }else {
                    res.json({status:'', code:204});
                }
            })
        }
    });

 });

router.get('/:id', function(req, res, next) {
    var user=req.user.id;
    PC.findOne({machineId:req.params.id, owner:req.query.user})
        .lean()
        .populate('owner')
        .exec(function (err, pc) {
            if (err) return next(err);
                pc.owner=pcUtils.getUserFromUserArray(pc.owner,user);
                res.json(pc);
        });
});



router.put('/:id', function(req, res, next) {
    PC.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, pc){
        if (err)  next(err);
        PC.populate(pc,'owner',function(err,result){
            if(err)next(err);
                var pc=result.toObject();
                pc.owner=pcUtils.getUserFromUserArray(result.owner,user);
                res.json(pc);
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
