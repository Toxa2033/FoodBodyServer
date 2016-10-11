/**
 * Created by 95tox on 17.09.2016.
 */
const www = require('../bin/www');
const Task = require('../bin/mongoose').model('task');
/*
function setTimerTask(task){
    var timeDiff = task.date.getTime() - new Date().getTime();
    if (task.completed == false && !task.exception && timeDiff>0) {
        console.log({startTimerFor:task.owner,mls:timeDiff});
        setTimeout(function () {
            Task.findById(task._id, function (err, callback) {
                if (err)return err;
                if (callback.completed == false && !callback.exception) {
                    console.log("send "+callback.pc._id);
                    www.socket.sockets.emit(task.pc._id, {type:'exec', task: task._id, user: task.owner._id});
                }

            });

        }, timeDiff);
    }

}

module.exports.setTimerTask=function(task){
    return setTimerTask(task);
};

module.exports.initTimers=function initTimers(){
    Task.find({})
        .populate('owner')
        .populate({path:'pc',populate:{path:'owner'}})
        .exec(function(err,callback) {
        if (err)return err;
        callback.forEach(function(item){
            setTimerTask(item);
        });
    });
};

*/