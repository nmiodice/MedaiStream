var FileTypes                = require('../../../common/constants/FileConstants').types;
var RemoteDirectoryActionCreator  = require('../actions/RemoteDirectoryActionCreator');
var ActiveAudioActionCreator = require('../actions/ActiveAudioActionCreator');

var FileHandler = {

    handleFile : function(file) {
        switch (file.type) {

            case FileTypes.DIRECTORY:
                RemoteDirectoryActionCreator.setDirectory(file);
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