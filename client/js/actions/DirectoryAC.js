var ActionTypes           = require('../constants/ActionTypes');
var AppDispatcher         = require('../dispatcher/AppDispatcher');
var FileAC                = require('./FileAC');
var FileAndDirectoryStore = require('../stores/FileAndDirectoryStore');
var ConnectionConstants   = require('../constants/ConnectionConstants');

var DirectoryAC = {

    moveUpDirectory : function() {

        AppDispatcher.dispatch({
            type : ActionTypes.URI_UP
        });
    },

    setDirectory : function(file) {
        FileAC.filter("");

        if (typeof file === 'string') {
            var fileObj = FileAndDirectoryStore.makeFile(ConnectionConstants.OFFLINE, file, [], 0);
            this._setDirectory(fileObj);
        } else {
            this._setDirectory(file, false);
        }
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
