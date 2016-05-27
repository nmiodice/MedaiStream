var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var FileActionCreator = require('./FileActionCreator');
var RemoteFileStore = require('../stores/RemoteFileStore');

var RemoteDirectoryActionCreator = {

    moveUpDirectory : function() {

        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_URI_UP
        });
    },

    setDirectory : function(file) {
        if (RemoteFileStore.getFilter() != "")
            FileActionCreator.filter("");
        this._setDirectory(file, false);
    },

    setDirectoryRecursive : function(file) {
        this._setDirectory(file, true);
    },

    _setDirectory : function(file, recursive) {
        console.log("changing to: " + file.path);
        AppDispatcher.dispatch({
            type      : ActionTypes.MEDIA_URI_CHANGE,
            path      : file.path,
            recursive : recursive,
            filter    : ""
        });

        FileActionCreator.fetchFiles();
    }
};

module.exports = RemoteDirectoryActionCreator;
