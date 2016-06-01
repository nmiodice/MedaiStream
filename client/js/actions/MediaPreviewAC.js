var ActionTypes      = require('../constants/ActionTypes');
var AppDispatcher    = require('../dispatcher/AppDispatcher');

var MediaPreviewAC = {

    setImage : function(file) {
        AppDispatcher.dispatch({
            type : ActionTypes.IMAGE_ACTIVE,
            file : file
        });
    },

    clearImage : function(file) {
        AppDispatcher.dispatch({
            type : ActionTypes.IMAGE_CLEAR,
            file : file
        });
    }
};

module.exports = MediaPreviewAC;
