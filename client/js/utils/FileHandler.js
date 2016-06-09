var FileTypes      = require('../constants/FileConstants').types;
var DirectoryAC    = require('../actions/DirectoryAC');
var ActiveAudioAC  = require('../actions/ActiveAudioAC');
var MediaPreviewAC = require('../actions/MediaPreviewAC');
var UriUtils       = require('./UriUtils');
var FileUtils      = require('./FileUtils');

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
            case FileTypes.TEXT:
                MediaPreviewAC.setFile(file);
                break;

            default:
                var fileName = FileUtils.fileToDisplayString(file);
                if (confirm("'" + fileName + "' cannot be opened. Do you want to download?") == true) {
                    window.open(UriUtils.fileToURI(file));
                }
                break;
        }
    }
};

module.exports = FileHandler;