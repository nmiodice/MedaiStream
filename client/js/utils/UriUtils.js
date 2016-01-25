var RemoteFileStore = require('../stores/RemoteFileStore');
var FileUtils       = require('./FileUtils');

var UriUtils = {
	fileToURI : function(file) {
		var currentURI = RemoteFileStore.getFileData().uri;
		newURI = currentURI + FileUtils.getLastPathSection(file);
		return newURI;
	}
};

module.exports = UriUtils;
