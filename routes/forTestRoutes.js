var express = require('express');

var routes = function (Outcome, Reflection, HotSpotBucket, User) {
    var forTestRouter = express.Router();

    forTestRouter.route('/')
        .delete(function (req, res) {
            Outcome.remove().exec()
                .then(function () {
                    return Reflection.remove().exec();
                })
                .then(function () {
                    return HotSpotBucket.remove().exec();
                })
                .then(function () {
                    return User.remove().exec();
                })
                .then(function () {
                    var user = new User();
                    user.local.username = 'bjaanes';
                    user.local.password = '1234';

                    return user.save();
                })
                .then(function () {
                     res.status(204).send();
                })
                .catch(function (e) {
                    console.log('something went wrong here ' + e.message);
                    res.status(500).send();
                });
        });

    return forTestRouter;

};

module.exports = routes;