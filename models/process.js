const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");
var async = require('async');

const ProcessSchema = new Schema({
    __v: {type: Number, select: false},
    name:{type:String},
    startTime:{type:Date},
    totalProcessorTime:{type:String},
    memory:{type:Number},
    machineName:{type:String},
    priorityClass:{type:String},
    priorityBoostEnabled:{type:Boolean},
    processId:{type:Number}

});

mongoose.model('Process', ProcessSchema);
