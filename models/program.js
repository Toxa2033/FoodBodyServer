/**
 * Created by 95tox on 14.09.2016.
 */
const mongoose = require('../bin/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

const ProgramSchema = new Schema({
    __v: {type: Number, select: false},
    programName:{type:String},
    paths:{type:[{
        path:{type: String},
        fileName:{type:String}
    }],default:[]},
    displayVersion:{type:String}
});

mongoose.model('program', ProgramSchema);
