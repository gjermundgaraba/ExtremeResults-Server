var mongoose = require('mongoose'),
    hash = require('../utils/hash').hash,
    Schema = mongoose.Schema;

var userModel = new Schema({
    local: {
        username: String,
        hash: String,
        salt: String
    }
});

userModel.methods.validatePassword = function(password, cb) {
    var user = this;
    hash(password, user.local.salt, function (error, hash) {
         if (error) {
             cb(error, false);
         } else if (hash == user.local.hash) {
             cb(null, true);
         } else {
             cb(null, false);
         }
    });
};

module.exports = mongoose.model('User', userModel);