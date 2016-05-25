var $               = require('jquery');
var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var RemoteFileStore = require('../stores/RemoteFileStore');
var UriUtils        = require('../utils/UriUtils');

var RemoteDirectoryActionCreator = {

    moveUpDirectory : function() {

        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_URI_UP
        });
    },

    setDirectory : function(file) {
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
            recursive : recursive
        });

        this.fetchFiles();
    },

    fetchFiles : function() {
        console.log("requesting files from server");

        var parent = RemoteFileStore.getFileData();
        var uri = UriUtils.directoryToURI(parent);
      
        $.getJSON(uri, function(result) {

            if (result && result.files) {
                AppDispatcher.dispatch({
                    type   : ActionTypes.MEDIA_FILES_CHANGE,
                    parent : parent,
                    files  : result.files
                });

            } else {
            
                AppDispatcher.dispatch({
                    type  : ActionTypes.MEDIA_REQUEST_FAILED
                });

            }
        });
    },

    setSelectedRow : function(file) {

        AppDispatcher.dispatch({
            type  : ActionTypes.UI_ROW_SELECTED,
            path  : file
        });        
    }
};

module.exports = RemoteDirectoryActionCreator;
