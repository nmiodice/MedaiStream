var FileUtils = require('../utils/FileUtils')

var handler = {
	handle : function(request, response, filePath, recursive) {

		var content = {};
		var cbk = function(err, files) {
			if (!err) {
				content.files = files;
				var type = FileUtils.getMimeType("application/json");
				response.writeHead(200, { 'Content-Type': type });
				response.end(JSON.stringify(content), 'utf-8');
			} else {
				console.log(err);
			}
		};

		if (recursive) {
			FileUtils.getRecursiveFileListing(filePath, cbk);
		} else {
			FileUtils.getFileListing(filePath, cbk);
		}
	}
}

module.exports = handler;
