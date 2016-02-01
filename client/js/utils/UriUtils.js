var RemoteFileStore = require('../stores/RemoteFileStore');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	fileToURI : function(file) {
		console.log("converting file to uri: ");
		console.log(file);
		
		uri = file.path;
		uri = ServerConstants.MEDIA_HOME_BASE + '?' + ServerConstants.MEDIA_QPARAM + '=' + uri;
		return encodeURIComponent(uri);
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
