var registerController = function (User, jwt, secret, hash) {

    var post = function (req, res) {

        hash(req.body.password, function (error, salt, hash) {
            if (error) {
                return res.status(500).send(error);
            }
            
            var user = new User();
            user.local.username = req.body.username;
            user.local.salt = salt;
            user.local.hash = hash;
            
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
        });

        
    };

    return {
        post: post
    }

};

module.exports = registerController;