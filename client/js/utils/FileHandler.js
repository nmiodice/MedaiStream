var FileTypes                = require('../constants/FileConstants').types;
var DirectoryActionCreator  = require('../actions/DirectoryActionCreator');
var ActiveAudioActionCreator = require('../actions/ActiveAudioActionCreator');

var FileHandler = {

    handleFile : function(file) {
        switch (file.type) {

            case FileTypes.DIRECTORY:
                DirectoryActionCreator.setDirectory(file);
                break;

            case FileTypes.FILE:
                ActiveAudioActionCreator.setActivePlaylist(file);
                break;

            default:
                console.log("cannot handle file. type: " + file.type);
                break;
        }
    }
};

module.exports = FileHandler;