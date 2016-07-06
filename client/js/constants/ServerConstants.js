var protocol    = "http://";
var server_ip   = "127.0.0.1";
var server_port = 8080;
var base        = protocol + server_ip + ":" + server_port;

var constants = {
	PROTOCOL                 : protocol,
	SERVER_IP                : server_ip,
	BASE                     : base,
	FILE_REQUEST_PATH        : '/file/',
	DIRECTORY_REQUEST_PATH   : '/ls/',	// get JSON file listing from server
	DIRECTORY_WILDCARD_PATH  : '/files',		// wildcard to return index for any URL
	DIRECTORY_QPARAM         : 'directory',
	RECURSE_QPARAM           : 'recursive'
};

module.exports = constants;
