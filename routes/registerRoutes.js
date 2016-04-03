var express = require('express');
var jwt = require('jwt-simple');

var routes = function (User, secret) {
    var registerRouter = express.Router();

    var registerController = require('../controllers/registerController')(User, jwt, secret);

    registerRouter.route('/')
        .post(registerController.post);

    return registerRouter;

};

module.exports = routes;