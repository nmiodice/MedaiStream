var FileTypes                = require('../constants/FileConstants').types;
var DirectoryAC  = require('../actions/DirectoryAC');
var ActiveAudioAC = require('../actions/ActiveAudioAC');
var MediaPreviewAC = require('../actions/MediaPreviewAC');

var FileHandler = {

    handleFile : function(file) {
        switch (file.type) {

            case FileTypes.DIRECTORY:
                DirectoryAC.setDirectory(file);
                break;

            case FileTypes.AUDIO:
                ActiveAudioAC.setActivePlaylist(file);
                break;

            case FileTypes.IMAGE:
            case FileTypes.VIDEO:
                MediaPreviewAC.setFile(file);
                break;

            default:
                alert("Cannot open file!");
                break;
        }
    }
};

module.exports = FileHandler;