/**
 * Created by 95tox on 05.11.2016.
 */
function getUserFromUserArray(arrayUser, userId,callback){
    for(var i=0; i<arrayUser.length; i++){
        var owner=arrayUser[i];
        if(owner._id==userId){
            return owner;
        }
    }
    return null;
}

function processPc(pcs,userID,callback){
    pcs.forEach(function(item,i,array){
        item.owner=getUserFromUserArray(item.owner,userID);
        if(i==array.length-1)callback(pcs);
    });
}

function processTask(tasks,userID,callback){
    if(tasks.length==0)callback(tasks);
    tasks.forEach(function(item,i,array){
        console.log(tasks);
        if(item.pc)item.pc.owner=getUserFromUserArray(item.pc.owner,userID);
        if(i==array.length-1) callback(tasks);
    });
}

module.exports={
    processPC:function(pcs,userId,callback){
        processPc(pcs,userId,callback)
    },
    getUserFromUserArray:function(arrayUser,userId){
       return getUserFromUserArray(arrayUser,userId);
    },
    processTask:function(tasks,userId,callback){
        processTask(tasks,userId,callback)
    }
};