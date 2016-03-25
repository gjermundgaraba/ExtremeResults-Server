var express = require('express');

var routes = function (User, passport) {
    var loginRouter = express.Router();

    var loginController = require('../controllers/loginController')();

    loginRouter.route('/')
        .post(passport.authenticate('local', {session: false}), loginController.post);

    return loginRouter;

};

module.exports = routes;