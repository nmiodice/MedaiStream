var FileTypes                = require('../constants/FileConstants').types;
var DirectoryActionCreator  = require('../actions/DirectoryActionCreator');
var ActiveAudioActionCreator = require('../actions/ActiveAudioActionCreator');
var ActiveImageActionCreator = require('../actions/ActiveImageActionCreator');

var FileHandler = {

    handleFile : function(file) {
        switch (file.type) {

            case FileTypes.DIRECTORY:
                DirectoryActionCreator.setDirectory(file);
                break;

            case FileTypes.AUDIO:
                ActiveAudioActionCreator.setActivePlaylist(file);
                break;

            case FileTypes.IMAGE:
                ActiveImageActionCreator.setImage(file);
                break;

            default:
                alert("Cannot open file!");
                break;
        }
    }
};

module.exports = FileHandler;