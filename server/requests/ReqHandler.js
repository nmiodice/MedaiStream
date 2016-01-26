var reqDirectory = require('./ReqDirectory');
var reqFile      = require('./ReqFile');
var reqError     = require('./ReqError');
var fileUtils    = require('../utils/FileUtils');
var fileTypes    = require('../../common/constants/FileConstants').types;
var fileErrors   = require('../../common/constants/FileConstants').errors;

var handler = {
	handle : function(request, response) {
		var filePath;
		var type;

		if (request.url == '/' | request.url == '/index.html') {
			filePath = './index.html';
		} else {
			filePath = fileUtils.relativeToClientDirectory(request.url);
		}

		filePath = decodeURIComponent(filePath);
		fileUtils.getType(filePath, function(type) {

			switch (type) {
				case fileTypes.FILE:
					reqFile.handle(request, response, filePath);
					break;

				case fileTypes.DIRECTORY:
					reqDirectory.handle(request, response, filePath)
					break;

				default:
					reqError.handle(request, response, { code : fileErrors.NOT_FOUND });
					break;
			}
		});
	}
}

module.exports = handler;
