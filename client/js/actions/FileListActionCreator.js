var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');

var FileListActionCreator = {

    setSelectedRow : function(file) {
        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_SELECTED,
            file  : file
        });        
    },

    nextRow : function() {
        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_NEXT,
        });
    },

    prevRow : function() {
        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_PREV,
        });
    }
};

module.exports = FileListActionCreator;
