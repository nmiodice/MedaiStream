var fileUtils = require('../utils/FileUtils')

var handler = {
	handle : function(request, response, filePath) {
		var content = fileUtils.getRecursiveFileListing(filePath).toString();
		var type = fileUtils.getMimeType(filePath);
		response.writeHead(200, { 'Content-Type': type });
		response.end(content, 'utf-8');  
	}
}

module.exports = handler;
