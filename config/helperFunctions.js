
function _respond(res, next, status, data, http_code) {
    var response = {
        'status': status,
        'data': data
    }
    res.setHeader('content-type', 'application/json');
    res.writeHead(http_code);
    res.end(JSON.stringify(response));
    return next();

}

module.exports.success = function (res, next, data) {
    _respond(res, next, 'success', data, 200);
}
module.exports.failure = function (res, next, data, http_code) {
    _respond(res, next, 'failure', data, http_code);
}

module.exports.randomAlphanumericNumber = function (leng) {
   
    var pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
       
        randomStr = n => Array(n).fill()
            .map(c => pool[~~(Math.random() * pool.length)])
            .join("")
      
        return randomStr(leng);

}

module.exports.randomNumericNumber = function (leng) {
   
    var pool = '0123456789',
       
        randomStr = n => Array(n).fill()
            .map(c => pool[~~(Math.random() * pool.length)])
            .join("")
      
        return randomStr(leng);

}

