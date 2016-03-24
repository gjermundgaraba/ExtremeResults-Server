var registerController = function (User) {

    var post = function (req, res) {
        var user = new User();
        user.local.username = req.body.username;
        user.local.password = req.body.password;

        user.save(function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(201).send();
            }
        });
    };

    return {
        post: post
    }

};

module.exports = registerController;