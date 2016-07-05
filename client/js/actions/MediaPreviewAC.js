var ActionTypes             = require('../constants/ActionTypes');
var AppDispatcher           = require('../dispatcher/AppDispatcher');
var ActiveMediaPreviewStore = require('../stores/ActiveMediaPreviewStore');
var FileTypes               = require('../constants/FileConstants').types;
var ActiveAudioStore        = require('../stores/ActiveAudioStore');
var ActiveAudioAC           = require('./ActiveAudioAC');

var _didPauseAudio = false;

var MediaPreviewAC = {

    setFile : function(file) {

        //if (ActiveMediaPreviewStore.getActiveFile() != null)
        //    this.clearFile();

        if (file.type == FileTypes.VIDEO) {
            if (ActiveAudioStore.getIsPlaying()) {
                _didPauseAudio = true;
                ActiveAudioAC.togglePlayState();
            }
        }

        AppDispatcher.dispatch({
            type : ActionTypes.PREVIEW_ACTIVE,
            file : file
        });
    },

    clearFile : function() {
        if (_didPauseAudio) {
            ActiveAudioAC.togglePlayState();
            _didPauseAudio = false;
        }

        AppDispatcher.dispatch({
            type : ActionTypes.PREVIEW_CLEAR
        });
    },

    nextFile : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.PREVIEW_NEXT
        });
    },

    previousFile : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.PREVIEW_PREV
        });
    }
};

module.exports = MediaPreviewAC;
