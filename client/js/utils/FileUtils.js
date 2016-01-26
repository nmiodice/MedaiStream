var FileConstants = require('../../../common/constants/FileConstants')

var FileUtils = {
	fileToDisplayString : function(file) {

		switch (file.type) {
			case FileConstants.types.DIRECTORY:
				return FileUtils.makeDirectoryName(FileUtils.getLastPathSection(file.path));

			default:
				return FileUtils.getLastPathSection(file.path);
		}
		
	},

	getLastPathSection : function(path) {
		if (path.slice(-1) == "/")
			path = path.substring(0, path.length - 1);
		return path.replace(/^.*(\\|\/|\:)/, '');
	},

	makeDirectoryName : function(path) {
		if (path.slice(-1) == "/")
			return path;
		return path + "/";
	}
}

module.exports = FileUtils;