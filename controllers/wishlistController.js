var helpers = require('../config/helperFunctions')
var Wishlist = require('../models/wishlistmodel');
var Wishlistitem = require('../models/wishlistitemmodel');
var User = require('../models/usermodel');

module.exports = function (server, jwt, dbconfig, jsonwebtoken) {

    //save wishlist
    server.post('/createwishlist', function (req, res, next) {

        //validations
        req.assert('usernumber', 'usernumber is required').notEmpty();
        req.assert('wishlistname', 'wishlistname is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            helpers.failure(res, next, errors, 400);
        }
        else {

            //check if user number exists
            User.findOne({ usernumber: req.params.usernumber }).select('username').exec(function (err, userdb) {

                if (err) {
                    helpers.failure(res, next, 'Internal server error', 500);
                }
                else {
                    // if user exists
                    if (userdb) {
                        //check if wishlist name already exists in the database
                        Wishlist.findOne({ wishlistname: req.params.wishlistname }).select('wishlistname').exec(function (err, wishlistdb) {
                            if (err) {
                                helpers.failure(res, next, 'Internal server error', 500);
                            }
                            if (wishlistdb) {
                                helpers.failure(res, next, 'Wish List with the same name already exists', 400);
                            }
                            else {
                                var wishlistNumber = helpers.randomAlphanumericNumber(5);

                                var wishlist = new Wishlist({
                                    usernumber: req.params.usernumber,
                                    wishlistnumber: wishlistNumber,
                                    wishlistname: req.params.wishlistname
                                });

                                //save the document
                                wishlist.save(function (err) {
                                    if (err) {
                                        helpers.failure(res, next, 'Error saving to the database', 500);
                                    }
                                    helpers.success(res, next, wishlist);

                                });
                            }
                        });

                    }
                    else {
                        helpers.failure(res, next, 'user does not exists', 400);
                    }
                }
            });
        }
    });

    //save wishlist item
    server.post('/createwishlistitem', function (req, res, next) {

        //validations
        req.assert('usernumber', 'usernumber is required').notEmpty();
        req.assert('wishlistnumber', 'wishlistnumber is required').notEmpty();
        req.assert('wishlistitemname', 'wishlistitemname is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            helpers.failure(res, next, errors, 400);
        }
        else {
            //check if user number exists
            User.findOne({ usernumber: req.params.usernumber }).select('username').exec(function (err, userdb) {

                if (err) {
                    helpers.failure(res, next, 'Internal server error', 500);
                }
                else {

                    // if user exists
                    if (userdb) {

                        //check if wishlist number exists in the database
                        Wishlist.findOne({ usernumber: req.params.usernumber, wishlistnumber: req.params.wishlistnumber }).select('_id wishlistname wishlistnumber usernumber').exec(function (err, wishlistdb) {
                            if (err) {
                                helpers.failure(res, next, 'Internal server error', 500);
                            }
                            if (!wishlistdb) {
                                helpers.failure(res, next, 'Wish list number not exists for this user', 400);
                            }
                            else {

                                //check if item with the same name already exists
                                Wishlist.find({"items.name": req.params.wishlistitemname}, function (err, model)
                                {
                                    if (err) 
                                    {
                                        helpers.failure(res, next, 'Internal server error', 500);
                                    }
                                    else
                                     {
                                        if (model.length > 0) 
                                        {
                                            helpers.failure(res, next, 'Wish list item name already exists', 400);
                                        }
                                        else
                                         {
                                            //wish list item number
                                            var wishlistItemNumber = helpers.randomNumericNumber(8);

                                            //insert item in the wish list    
                                            Wishlist.findByIdAndUpdate(
                                                wishlistdb._id,
                                                { $push: { "items": { name: req.params.wishlistitemname, number: wishlistItemNumber } } },
                                                { safe: true, upsert: true },
                                                function (err, model) {
                                                    if (err) {
                                                        helpers.failure(res, next, 'Internal server error', 500);
                                                    }
                                                    else {
                                                        helpers.success(res, next, model);
                                                    }
                                                }
                                            );

                                        }
                                    }
                                });
                            }
                        });
                    }
                    else 
                    {
                        helpers.failure(res, next, 'user does not exists', 400);
                    }
                }
            });
        }
    });
}