var ActionTypes      = require('../constants/ActionTypes');
var AppDispatcher    = require('../dispatcher/AppDispatcher');

var ActiveImageActionCreator = {

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

module.exports = ActiveImageActionCreator;
