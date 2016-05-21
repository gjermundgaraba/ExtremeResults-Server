var express = require('express');
var hash = require('../utils/hash').hash;

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
                    var password = '1234';

                    hash(password, function (error, salt, hash) {
                        if (error) {
                            return res.status(500).send(error);
                        }

                        var user = new User();
                        user.local.username = 'bjaanes';
                        user.local.salt = salt;
                        user.local.hash = hash;

                        user.save(function (error) {
                            if (error) {
                                console.log('something went wrong here ' + error.message);
                                res.status(500).send(error);
                            } else {
                                res.status(204).send();
                            }
                        });
                    });
                })
                .catch(function (e) {
                    console.log('something went wrong here ' + e.message);
                    res.status(500).send();
                });
        });

    return forTestRouter;

};

module.exports = routes;