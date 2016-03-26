var express = require('express');
var jwt = require('jwt-simple');

var routes = function (User, passport, secret) {
    var loginRouter = express.Router();

    var loginController = require('../controllers/loginController')(jwt, secret);

    loginRouter.route('/')
        .post(passport.authenticate('local', {session: false}), loginController.post);

    return loginRouter;

};

module.exports = routes;