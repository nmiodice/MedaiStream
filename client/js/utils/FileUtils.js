var FileTypes           = require('../constants/FileConstants').types;

var FileUtils = {

	fileToDisplayString : function(file) {
		return FileUtils.getLastPathSection(file.path);		
	},

	getLastPathSection : function(path) {
		if (path.slice(-1) == "/")
			path = path.substring(0, path.length - 1);
		return path.replace(/^.*(\\|\/|:)/, '');
	},

	fileToIconClass : function(file, isSelected) {
		switch (file.type) {
			case FileTypes.DIRECTORY:
				if (isSelected)
					return "glyphicon glyphicon-folder-open";
				else
					return "glyphicon glyphicon-folder-close";

			case FileTypes.AUDIO:
				return "glyphicon glyphicon-play-circle";

			case FileTypes.IMAGE:
				return "glyphicon glyphicon-picture";

			case FileTypes.VIDEO:
				return "glyphicon glyphicon-facetime-video";

			case FileTypes.COMPRESSED:
				return "glyphicon glyphicon-compressed";

			case FileTypes.TEXT:
				return "glyphicon glyphicon-pencil";

			default:
				return "glyphicon glyphicon-file";
		}
	}

};

module.exports = FileUtils;