var loginController = function () {

    var post = function (req, res) {
        res.status(200).send();
    };

    return {
        post: post
    }

};

module.exports = loginController;