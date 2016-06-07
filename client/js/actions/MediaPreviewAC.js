var ActionTypes             = require('../constants/ActionTypes');
var AppDispatcher           = require('../dispatcher/AppDispatcher');
var ActiveMediaPreviewStore = require('../stores/ActiveMediaPreviewStore');

var MediaPreviewAC = {

    setFile : function(file) {

        if (ActiveMediaPreviewStore.getActiveFile() != null)
            this.clearFile();

        AppDispatcher.dispatch({
            type : ActionTypes.IMAGE_ACTIVE,
            file : file
        });
    },

    clearFile : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.IMAGE_CLEAR
        });
    }
};

module.exports = MediaPreviewAC;
