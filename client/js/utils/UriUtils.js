var RemoteFileStore = require('../stores/RemoteFileStore');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	directoryToURI : function(file) {

		console.log("converting directory to uri: ");
		console.log(file);

		var uri = ServerConstants.DIRECTORY_REQUEST_PATH;
		uri += '?'
				+ encodeURIComponent(ServerConstants.DIRECTORY_QPARAM)
				+ "="
				+ encodeURIComponent(file.path)
				+ "&"
				+ encodeURIComponent(ServerConstants.RECURSE_QPARAM)
				+ '='
				+  encodeURIComponent(file.recursive ? '1' : '0');

		console.log('uri: ' + uri);
		return uri;
	},

	fileToURI : function(file) {
		console.log("converting file to uri: ");
		console.log(file);

		var fp = file.path;
		while(fp.charAt(0) === '/')
			fp = fp.substr(1);

		var uri = ServerConstants.FILE_REQUEST_PATH + fp;
		console.log('uri: ' + uri);
		return uri;
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
