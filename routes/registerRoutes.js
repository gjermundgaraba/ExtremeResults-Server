var express = require('express');

var routes = function (User) {
    var registerRouter = express.Router();

    var registerController = require('../controllers/registerController')(User);

    registerRouter.route('/')
        .post(registerController.post);

    return registerRouter;

};

module.exports = routes;