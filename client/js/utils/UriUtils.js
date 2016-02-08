var RemoteFileStore = require('../stores/RemoteFileStore');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	fileToURI : function(file, skip_recursive_flag) {
		console.log("converting file to uri: ");
		console.log(file);
		
		uri = file.path;
		uri = ServerConstants.MEDIA_HOME_BASE + '?' + ServerConstants.MEDIA_QPARAM + '=' + uri;
		if (skip_recursive_flag)
			return encodeURIComponent(uri);

		uri += '&' + ServerConstants.RECURSE_QPARAM + '=' + (file.recursive ? '1' : '0');
		return encodeURIComponent(uri);
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
