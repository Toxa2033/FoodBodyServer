const router = require('express').Router();
const User = require('../bin/mongoose').model('User');
const async = require('async');
const Task = require('../bin/mongoose').model('task');
const www = require('../bin/www');
const timer=require('../bin/timer');
const Request=require('../bin/mongoose').model('Request');
const pcUtils=require('../utils/pcUtils');

router.get('/', function(req, res, next) {
    var query;
    var user=req.user.id;
    console.log(user);
    if(req.query.user&&req.query.pc){
       query= {owner:req.query.user,pc:req.query.pc}
    } else if(req.query.user){
        query= {owner:req.query.user}
    } else if(req.query.pc){
        query= {pc:req.query.pc}
    }
    Task.find(query)
        .lean()
        .populate('owner')
        .populate({path:'pc',populate:{path:'owner'}})
        .populate('request')
        .exec(function (err, tasks) {
            if (err) return next(err);
            pcUtils.processTask(tasks,user,function(result){
                res.json(result);
            });
        });
});

router.post('/', function(req, res, next) {
    req.body.owner=req.body.owner._id;
    req.body.pc=req.body.pc._id;
    delete req.body.dateCreate;
    var task = new Task(req.body);
    var user=req.user.id;
    Task.find({process:task.process, pc:task.pc, owner:task.owner, completed:task.completed,
        exception:task.exception,dateCreate:task.dateCreate},function(err,result){
        if(err)next(err);
        if(result.length==0) {
            task.save({new:true},function (err, model) {
                if (err) return next(err);
                Task.findOne({process:model.process, pc:model.pc, owner:model.owner,
                    completed:model.completed,exception:task.exception,dateCreate:model.dateCreate})
                    .populate('owner')
                    .populate({path:'pc',populate:{path:'owner'}})
                    .lean()
                    .exec(function(err,callback){
                    if(err)next(err);
                        www.socket.sockets.emit(callback.owner._id,{type:'add_task', pc:callback.pc._id, task:callback._id, user:callback.owner._id});
                        returnTaskResult(callback,res,user);
                    });

            })
        } else{
            var error = new Error('Adding error. You contain this task');
            error.status = 403;
            next(error);
        }
    });

});


router.post('/request', function(req, res, next) {
    req.body.owner=req.body.owner._id;
    req.body.pc=req.body.pc._id;
    if(req.body.type<1 && !req.body.request){
      var err=new Error("Wrong request");
        err.status=403;
        next(err);
    }
    delete req.body.dateCreate;

    var request= new Request(req.body.request);

    delete req.body.request;
    var user=req.user.id;

    var task = new Task(req.body);

            task.save(function (err, model) {
                if (err) return next(err);
                request.task=model._id;
                request.save(function(err,reque){
                            if(err)next(err);
                    Task.findByIdAndUpdate(model._id,{request:reque._id},{new:true,upsert:true})
                        .populate(['request',{path:'pc',populate:{path:'owner'}}, 'owner'])
                        .lean()
                        .exec(function(err,callback){
                            if(err)next(err);
                            var socketMSG={type:'add_task_request', pc:callback.pc._id, task:callback._id, user:callback.owner._id};
                             www.socket.sockets.emit(callback.owner._id, socketMSG);
                            returnTaskResult(callback,res,user);
                        });

                });

    });

});


router.get('/:id', function(req, res, next) {
    var user=req.user.id;
    Task.findById(req.params.id)
        .lean()
        .populate('owner')
        .populate({path:'pc',populate:{path:'owner'}})
        .populate('request')
        .exec(function (err, task) {
            if (err) return next(err);
            returnTaskResult(task,res,user);
        });
});

router.put('/request/:id', function(req, res, next) {
    var user=req.user.id;

    Request.findByIdAndUpdate(req.params.id, req.body.request, {new: true,upsert:true}, function (err, model){
        if (err) return next(err);
       delete req.body.request;
        Task.findByIdAndUpdate(model.task,req.body,{new:true,upsert:true})
            .populate(['owner',{path:'pc',populate:{path:'owner'}},'request'])
            .lean()
            .exec(function(err,callback){
                if(err)next(err);
                var taskMsg;
                if(model.response) {
                    taskMsg={type:'task_get_response', pc:callback.pc._id, task:callback._id, user:callback.owner._id};
                } else if(model.completed==false) {
                    taskMsg={type:'task_update_request', pc:callback.pc._id, task:callback._id, user:callback.owner._id};
                }
                console.log(taskMsg);
                www.socket.sockets.emit(taskMsg.user,taskMsg);
                returnTaskResult(callback,res,user);
            });

    });
});

router.put('/:id', function(req, res, next) {
    var user=req.user.id;

    Task.findByIdAndUpdate(req.params.id, req.body, {new: true,upsert:true}, function (err, model){
        if (err) return next(err);
        var taskMsg;
        if(model.completed==true) {
            taskMsg={type:'task_exec', pc:model.pc, task:model._id, user:model.owner};
        } else if(model.completed==false) {
            taskMsg={type:'task_update', pc:model.pc, task:model._id, user:model.owner};
        }
        console.log(taskMsg);
        www.socket.sockets.emit(taskMsg.user,taskMsg);

        Task.populate(model,['owner',{path:'pc',populate:{path:'owner'}},'request'],function(err,callback){
            if(err)next(err);
            var task=callback.toObject();
            returnTaskResult(task,res,user);
        });
    });
});

router.delete('/:id', function(req, res, next) {
    var user=req.user.id;
    Task.remove({_id: req.params.id}, function (err, task){
        if (err) return next(err);
        returnTaskResult(task,res,user);
    })
});

function returnTaskResult(task,res,user){
        task.pc.owner = pcUtils.getUserFromUserArray(task.pc.owner,user);
        res.json(task);
}

module.exports = router;
