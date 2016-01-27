var RemoteFileStore = require('../stores/RemoteFileStore');
var FileUtils       = require('./FileUtils');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	fileToURI : function(file) {
		console.log("converting file to URI");
		console.log(file);
		
		newURI = file.path;
		newURI = ServerConstants.BASE + '?' + ServerConstants.MEDIA_QPARAM + '=' + newURI;
		return encodeURIComponent(newURI);
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
