module.exports = function (server, restify, restifyValidtor,jwt,dbconfig) {

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(restifyValidtor);
    server.use(jwt({ secret:dbconfig.secretKey}).unless({path: ['/authenticate','/registeruser','/createwishlistitem']}));
}