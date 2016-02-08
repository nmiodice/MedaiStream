var reqDirectory  = require('./ReqDirectory');
var reqFile       = require('./ReqFile');
var reqError      = require('./ReqError');
var fileUtils     = require('../utils/FileUtils');
var fileTypes     = require('../../common/constants/FileConstants').types;
var fileErrors    = require('../../common/constants/FileConstants').errors;
var fileLocations = require('../constants/FileLocationConstants');
var url           = require('url');
var path          = require('path');

var handler = {
	handle : function(request, response) {
		var decoded = url.parse(decodeURIComponent(request.url), true);
		var queryData = decoded.query;
		var filePath  = decoded.pathname;

		while (filePath.charAt(0) == '/' || filePath.charAt(0) == '.')
			filePath = filePath.substring(1);

		if (queryData && queryData.media) {

			var media = queryData.media;
			while (media.charAt(0) == '/' || media.charAt(0) == '.')
				media = media.substring(1);

			console.log(queryData);
			filePath = path.format({
				dir       : fileLocations.APP_LOCATION,
				base      : media
			});
		} else {
			if (filePath == '') {
				filePath = 'index.html';
			}

			filePath = path.format({
				dir  : fileLocations.ASSETS_LOCATION,
				base : filePath,
			});
		}

		console.log(filePath)
		fileUtils.getType(filePath, function(type) {

			switch (type) {
				case fileTypes.FILE:
					reqFile.handle(request, response, filePath);
					break;

				case fileTypes.DIRECTORY:
					reqDirectory.handle(request, response, filePath, queryData.recursive == '1')
					break;

				default:
					reqError.handle(request, response, { code : fileErrors.NOT_FOUND });
					break;
			}
		});
	}
}

module.exports = handler;
