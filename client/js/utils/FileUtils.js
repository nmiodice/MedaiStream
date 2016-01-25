var FileConstants = require('../../../common/constants/FileConstants')

var FileUtils = {
	fileToDisplayString : function(file) {
		switch (file.type) {
			case FileConstants.types.DIRECTORY:
				return FileUtils.getLastPathSection(file) + "/";

			default:
				return FileUtils.getLastPathSection(file);
		}
		
	},

	getLastPathSection : function(file) {
		return file.path.replace(/^.*(\\|\/|\:)/, '');
	}
}

module.exports = FileUtils;