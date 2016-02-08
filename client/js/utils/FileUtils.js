var FileConstants            = require('../../../common/constants/FileConstants')
var FileTypes                = require('../../../common/constants/FileConstants').types;
var RemoteFileActionCreator  = require('../actions/RemoteFileActionCreator');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');

var FileUtils = {

	fileToDisplayString : function(file) {
		return FileUtils.getLastPathSection(file.path);		
	},

	getLastPathSection : function(path) {
		if (path.slice(-1) == "/")
			path = path.substring(0, path.length - 1);
		return path.replace(/^.*(\\|\/|\:)/, '');
	},

	handleFile : function(file) {
		console.log(RemoteFileActionCreator);
        switch (file.type) {
        	
            case FileTypes.DIRECTORY:
                RemoteFileActionCreator.setFile(file);
                break;

            case FileTypes.FILE:
                ActiveMediaActionCreator.setActivePlaylist(file);
                break;

            default:
            	console.log("cannot handle file. type: " + file.type);
                break;
        }
	}
}

module.exports = FileUtils;