var FileTypes                = require('../constants/FileConstants').types;
var DirectoryActionCreator  = require('../actions/DirectoryActionCreator');
var ActiveAudioActionCreator = require('../actions/ActiveAudioActionCreator');

var FileHandler = {

    handleFile : function(file) {
        switch (file.type) {

            case FileTypes.DIRECTORY:
                DirectoryActionCreator.setDirectory(file);
                break;

            case FileTypes.AUDIO:
                ActiveAudioActionCreator.setActivePlaylist(file);
                break;

            default:
                alert("Cannot open file!");
                break;
        }
    }
};

module.exports = FileHandler;