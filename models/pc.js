const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');
const Process = require('../bin/mongoose').model('Process');

const PcSchema = new Schema({
    __v: {type: Number, select: false},
    pcName: {type:String, trim:true, required: true},
    startedProcess: {type: Array, default: []},
    machineId:{type:String,required: true},
    owner:{type:[{type:Schema.ObjectId, ref:"User", unique: true}],default:[]},
    installSoftware:{type:Array, default:[]},
    online:{type:Boolean}
});

mongoose.model('Pc', PcSchema);
