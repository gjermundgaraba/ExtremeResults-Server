var express = require('express');

var routes = function (Reflection, passport) {
    var reflectionRouter = express.Router();

    var reflectionController = require('../controllers/reflectionController')(Reflection);

    reflectionRouter.use(passport.authenticate('bearer', { session: false }));

    reflectionRouter.route('/')
        .get(reflectionController.get)
        .post(reflectionController.post);

    reflectionRouter.use('/:reflectionId', function (req, res, next) {
        Reflection.findById(req.params.reflectionId, function (err, reflection) {
            if (err) {
                res.status(500).send(err);
            } else if (reflection) {
                if (!reflection.user.equals(req.user._id)) {
                    res.status(403).send('You don\'t have access to this reflection');
                } else {
                    req.reflection = reflection;
                    next();
                }
            } else {
                res.status(404).send('No reflection with that id found');
            }
        });
    });
    reflectionRouter.route('/:reflectionId')
        .get(reflectionController.reflectionId.get)
        .put(reflectionController.reflectionId.put)
        .delete(reflectionController.reflectionId.delete);

    return reflectionRouter;

};

module.exports = routes;