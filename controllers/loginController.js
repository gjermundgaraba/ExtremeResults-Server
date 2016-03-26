var loginController = function (jwt, secret) {

    var post = function (req, res) {
        var payload = {
            username: req.body.username
        };

        var token = jwt.encode(payload, secret);

        res.json({ token: token });
    };

    return {
        post: post
    }

};

module.exports = loginController;