var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var FileActionCreator = require('./FileActionCreator');
var FileAndDirectoryStore = require('../stores/FileAndDirectoryStore');

var DirectoryActionCreator = {

    moveUpDirectory : function() {

        AppDispatcher.dispatch({
            type : ActionTypes.URI_UP
        });
    },

    setDirectory : function(file) {
        if (FileAndDirectoryStore.getFilter() != "")
            FileActionCreator.filter("");
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

        FileActionCreator.fetchFiles();
    }
};

module.exports = DirectoryActionCreator;
