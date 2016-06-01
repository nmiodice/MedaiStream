var ActionTypes         = require('../constants/ActionTypes');
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var SelectedFileStore   = require('../stores/SelectedFileStore');

var SelectedFileAC = {

    setSelectedRow : function(file) {
        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_SELECTED,
            file  : file
        });        
    },

    nextRow : function(parent) {
        // set first row to be active if none is active yet
        if (SelectedFileStore.getSelectedFile() == null) {
            if (parent && parent.files.length > 0) {
                this.setSelectedRow(parent.files[0]);
            }
        } else {
            AppDispatcher.dispatch({
                type  : ActionTypes.UI_ROW_NEXT
            });
        }
    },

    prevRow : function() {
        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_PREV
        });
    }
};

module.exports = SelectedFileAC;
