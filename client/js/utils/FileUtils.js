
var FileUtils = {

	fileToDisplayString : function(file) {
		return FileUtils.getLastPathSection(file.path);		
	},

	getLastPathSection : function(path) {
		if (path.slice(-1) == "/")
			path = path.substring(0, path.length - 1);
		return path.replace(/^.*(\\|\/|:)/, '');
	}

};

module.exports = FileUtils;