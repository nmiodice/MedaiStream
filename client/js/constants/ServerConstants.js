var protocol    = "http://";
var server_ip   = "127.0.0.1";
var server_port = 8080
var base        = protocol + server_ip + ":" + server_port;

var constants = {
	PROTOCOL          : protocol,
	SERVER_IP         : server_ip,
	BASE              : base,
	MEDIA_HOME_BASE   : '/',
	MEDIA_QPARAM      : 'media',
};

module.exports = constants
