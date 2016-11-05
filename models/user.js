const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');
const PC = require('../bin/mongoose').model('Pc');

const UserSchema = new Schema({
    __v: {type: Number, select: false},
    login: {type:String, trim:true, required: true},
    password:{type:String, required:true},
    email: {type: String},
    deviceToken:{type:[{type:String}],default:[], select:false}
});


UserSchema.statics.authorize = function (userData, pc,  callback) {
    var User = this;
    var query={login:userData.login,password:userData.password};
    User.find(query,function(err,user){
        if(err)callback(err);
        if(user.length==0){
           var error = new Error('Auth error');
           error.status = 403;
           return callback(error);
       }
        callback(null,user[0]);
    });
};

UserSchema.statics.register = function (userData,pc, callback) {
    var User = this;
    var query = {login: userData.login};
    User.find(query, function (err, model) {
        if (err)callback(err);
        console.log(model);
        if (model.length != 0) {
            var error = new Error('Login is used');
            error.status = 403;
            return callback(error);
        }
        new User(userData).save(function (err, user) {
            if (err)callback(err);
            callback(null, user);
        });
    });
};

function addPc(pc,user,callback){
    PC.findOne({pcName:pc.pcName,owner:pc.owner},function(err,model){
            if(err)callback(err);

        if(model==null){
            new PC(pc).save(function(err){
                if(err)callback(err);
               findPc(user,callback);
            });
        } else{
            findPc(user,callback);
        }

});
    }

function findPc(user,callback){
    PC.find({owner:user._id})
        .lean()
        .populate('owner')
        .exec(function(err,models){
            if(err)callback(err);
            user.PCs=models;
            callback(null,user)
        });
}


mongoose.model('User', UserSchema);
