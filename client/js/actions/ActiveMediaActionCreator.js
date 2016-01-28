var ActionTypes      = require('../constants/ActionTypes');
var AppDispatcher    = require('../dispatcher/AppDispatcher');
var ActiveMediaStore = require('../stores/ActiveMediaStore');

var ActiveMediaActionCreator = {

    setActivePlaylist : function(file) {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_NEW_PLAYLIST,
            file : file 
        });
    },

    togglePlayState : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_PLAY_STATE_TOGGLE,
        });	
    },

    nextTrack : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_NEXT_TRACK
        });
    },

    previousTrack : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_PREV_TRACK
        });
    }
};

module.exports = ActiveMediaActionCreator;
