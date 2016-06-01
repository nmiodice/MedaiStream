var ActionTypes      = require('../constants/ActionTypes');
var AppDispatcher    = require('../dispatcher/AppDispatcher');

var ActiveAudioAC = {

    setActivePlaylist : function(file) {
        AppDispatcher.dispatch({
            type : ActionTypes.AUDIO_NEW_PLAYLIST,
            file : file 
        });
    },

    togglePlayState : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.AUDIO_PLAY_STATE_TOGGLE
        });	
    },

    nextTrack : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.AUDIO_NEXT_TRACK
        });
    },

    previousTrack : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.AUDIO_PREV_TRACK
        });
    },

    setVolume : function(volume) {
        AppDispatcher.dispatch({
            type   : ActionTypes.AUDIO_VOLUME_CHANGE,
            volume : volume
        });
    },

    setSeekPosition : function(secs) {
        AppDispatcher.dispatch({
            type : ActionTypes.AUDIO_SEEK,
            time : secs
        });
    }
};

module.exports = ActiveAudioAC;
