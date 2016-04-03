var registerController = function (User, jwt, secret) {

    var post = function (req, res) {
        var user = new User();
        user.local.username = req.body.username;
        user.local.password = req.body.password;

        user.save(function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                var payload = {
                    username: user.local.username
                };

                var token = jwt.encode(payload, secret);

                res.status(201).send({ token: token });
            }
        });
    };

    return {
        post: post
    }

};

module.exports = registerController;