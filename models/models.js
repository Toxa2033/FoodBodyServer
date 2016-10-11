var models = ['request.js','process.js','program.js','pc.js','user.js','task.js'];

exports.initialize = function() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
        require('./' + models[i]);
    }
};