const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

const ToDoSchema = new Schema({
    __v: {type: Number, select: false},
    owner:{type:Schema.Types.ObjectId, ref:'User'},
    type:{type:Number}, //0-rill, 1-open, 2-cmd, 3-path
    request:{type:Schema.Types.ObjectId, ref:'Request'},
    pc:{type:Schema.Types.ObjectId, ref:'Pc'},
    date:{type:Date,  default: Date.now},
    dateCreate:{type:Date, default: Date.now},
    process:{type:String},
    completed:{type:Boolean,default:false},
    exception:{type:String},
    dateCompleted:{type:Date}

});

mongoose.model('task', ToDoSchema);
