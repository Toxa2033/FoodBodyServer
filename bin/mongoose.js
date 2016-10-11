/**
 * Created by Алексей on 29.07.2016.
 */
var mongoose = require('mongoose');
var config = require('../config/index');
mongoose.Promise = global.Promise;

mongoose.connect(config.get('mongoose:url'));

module.exports = mongoose;