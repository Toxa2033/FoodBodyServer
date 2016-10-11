const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

const RequestSchema = new Schema({
    __v: {type: Number, select: false},
    task:{type:Schema.Types.ObjectId, ref:'task'},
    cmd:{type:String},
    path:{type:String},
    response:{type: String}

});

mongoose.model('Request', RequestSchema);
