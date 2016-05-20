var express = require('express');
var jwt = require('jwt-simple');
var hash = require('../utils/hash').hash;

var routes = function (User, secret) {
    var registerRouter = express.Router();

    var registerController = require('../controllers/registerController')(User, jwt, secret, hash);

    registerRouter.route('/')
        .post(registerController.post);

    return registerRouter;

};

module.exports = routes;