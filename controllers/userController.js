var helpers = require('../config/helperFunctions')
var User = require('../models/usermodel');
module.exports = function (server, jwt, dbconfig, jsonwebtoken) {

    //authenticate user
    server.post('/authenticate', function (req, res, next) {

        //validations
        req.assert('username', 'username is required').notEmpty();
        req.assert('password', 'password is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            helpers.failure(res, next, errors, 400);
        }

        //find user with the username and password   
        User.findOne({
            username: req.params.username, password: req.params.password
        }).select('username').exec(function (err, userdb) {
            if (err) {
                helpers.failure(res, next, 'Internal srver error', 500);
            }
            if (userdb) {
                var profile = {
                    username: req.params.username,
                    password: req.params.password
                };
                //generate token
                var token = jsonwebtoken.sign(profile, dbconfig.secretKey, { expiresIn: 1440 });
                helpers.success(res, next, token);
            }
            else {
                helpers.failure(res, next, 'User not exists', 400);
            }
        });
    });

    //register user
    server.post('/registeruser', function (req, res, next) {

        //validations
        req.assert('name', 'name is required').notEmpty();
        req.assert('username', 'username is required').notEmpty();
        req.assert('password', 'password is required').notEmpty();
        req.assert('mobile', 'mobile number is required').notEmpty();
        req.assert('email', 'email is required and should be a valid email').notEmpty().isEmail();

        var errors = req.validationErrors();

        if (errors) {
            helpers.failure(res, next, errors, 400);
        }
        //check if username already exists in the database
        User.findOne({
            username: req.params.username
        }).select('username').exec(function (err, userdb) {

            if (err) {
                helpers.failure(res, next, 'Internal server error', 500);
            }
            if (userdb) {
                helpers.failure(res, next, 'User with the same username already exists', 400);
            }
            else 
            {
                //get the last inserted document
                User.findOne({}, {}, { sort: { 'created': -1 } }, function (err, latestUserSaved) 
                {
                    if (err)
                     {
                        helpers.failure(res, next, 'Error registering a user', 500);
                     }
                    else
                     {
                        //user object to save in the database
                        var user = new User({
                            usernumber: parseInt(latestUserSaved.usernumber) + 1,
                            name: req.params.name,
                            username: req.params.username,
                            password: req.params.password,
                            mobile: req.params.mobile,
                            email: req.params.email
                        });
                        //save the document
                        user.save(function (err) {
                            if (err) {
                                helpers.failure(res, next, 'Error saving to the database', 500);
                            }
                        });
                        helpers.success(res, next, user);
                    }
                });
            }
        });
    });

    //get all registered users
    server.get('/getallusers', function (req, res, next) {

        User.find({}, function (err, userdb) {

            if (err) {
                helpers.failure(res, next, 'Error reteriving users from database', 500);
            }
            helpers.success(res, next, userdb);

        })
    });

    //get user
    server.get('/user', function (req, res, next) {

        req.assert('username', 'username is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            helpers.failure(res, next, errors, 400);
        }

        User.find({ username: req.params.username }, function (err, userdb) {

            if (err) {
                helpers.failure(res, next, 'Error reteriving users from database', 500);
            }
            helpers.success(res, next, userdb);
        });
    });

}