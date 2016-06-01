var ActionTypes           = require('../constants/ActionTypes');
var AppDispatcher         = require('../dispatcher/AppDispatcher');
var FileAC                = require('./FileAC');
var FileAndDirectoryStore = require('../stores/FileAndDirectoryStore');

var DirectoryAC = {

    moveUpDirectory : function() {

        AppDispatcher.dispatch({
            type : ActionTypes.URI_UP
        });
    },

    setDirectory : function(file) {
        if (FileAndDirectoryStore.getFilter() != "")
            FileAC.filter("");
        this._setDirectory(file, false);
    },

    setDirectoryRecursive : function(file) {
        this._setDirectory(file, true);
    },

    _setDirectory : function(file, recursive) {
        console.log("changing to: " + file.path);
        AppDispatcher.dispatch({
            type      : ActionTypes.URI_CHANGE,
            path      : file.path,
            recursive : recursive,
            filter    : ""
        });

        FileAC.fetchFiles();
    }
};

module.exports = DirectoryAC;
