var RemoteFileStore = require('../stores/RemoteFileStore');
var ServerConstants = require('../constants/ServerConstants')

var UriUtils = {
	fileToURI : function(file, skip_recursive_flag) {

		//console.log("converting file to uri: ");
		//console.log(file);
		
		var uri = encodeURIComponent(ServerConstants.MEDIA_HOME_BASE)
			  + '?'
			  + encodeURIComponent(ServerConstants.MEDIA_QPARAM)
			  + '='
			  + encodeURIComponent(file.path)

		if (skip_recursive_flag === undefined || !skip_recursive_flag) {
			uri += '&'
			+ encodeURIComponent(ServerConstants.RECURSE_QPARAM)
			+ '='
			+  encodeURIComponent(file.recursive ? '1' : '0');
		}

		uri = encodeURIComponent(uri); // Howler.js won't load audio w/o this encoding
		//console.log(uri);
		return uri;
	},

	stripHTTP : function(uri) {
		return uri.replace(ServerConstants.BASE, '');
	}
};

module.exports = UriUtils;
