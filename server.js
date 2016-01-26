var http       = require('http');
var reqHandler = require('./server/requests/ReqHandler')

http.createServer(function (request, response) {
    reqHandler.handle(request, response);
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
