var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    local: {
        email: String,
        password: String
    }
});

userModel.methods.validPassword = function(password) {
    return password === this.local.password;
};

module.exports = mongoose.model('User', userModel);