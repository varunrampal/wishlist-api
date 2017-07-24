var restify = require('restify');
var mongoose = require('mongoose');
var dbconfig = require('./config/dbconfig');
var jwt = require('restify-jwt');
var jsonwebtoken = require('jsonwebtoken');

var server = restify.createServer();

var setupController = require('./controllers/setupController');
var userController = require('./controllers/userController');
var wishlistController = require('./controllers/wishlistController');
var restifyValidator = require('restify-validator');

setupController(server,restify,restifyValidator,jwt,dbconfig);
userController(server,jwt,dbconfig,jsonwebtoken);
wishlistController(server,jwt,dbconfig,jsonwebtoken);

//connect to the database
mongoose.connect(dbconfig.database,function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected to the database');
    }
});

server.listen(2001, function () {

    console.log('%s listening at %s', server.name, server.url);

});