var RemoteFileStore = require('../stores/RemoteFileStore');
var FileUtils       = require('./FileUtils');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	fileToURI : function(file) {
		var currentURI = RemoteFileStore.getFileData().uri;
		newURI = currentURI + FileUtils.getLastPathSection(file.path);
		return newURI;
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
