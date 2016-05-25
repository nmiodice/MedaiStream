var FileUtils = require('../utils/FileUtils');
var reqError  = require('./ReqError');

var handler = {
	handle : function(request, response, filePath) {
		var contentType = FileUtils.getMimeType(filePath);
		FileUtils.read(filePath, function(error, content, size) {
            if (error) {
                console.log(error);
                reqError.handle(request, response, error);
            } else {
                response.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': size
                });
                response.end(content, 'utf-8');
            }
        });
	}
}

module.exports = handler;
