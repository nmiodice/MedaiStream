var fileUtils = require('../utils/FileUtils')

var handler = {
	handle : function(request, response, filePath) {
		var content =  {
			files : fileUtils.getFileListing(filePath)
		};
		var type = fileUtils.getMimeType("application/json");
		response.writeHead(200, { 'Content-Type': type });
		response.end(JSON.stringify(content), 'utf-8');  
	}
}

module.exports = handler;
