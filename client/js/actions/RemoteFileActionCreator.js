var $               = require('jquery');
var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var RemoteFileStore = require('../stores/RemoteFileStore');
var FileUtils       = require('../utils/FileUtils');
var UriUtils        = require('../utils/UriUtils');
var ServerConstants = require('../constants/ServerConstants');

var RemoteFileActionCreator = {

    goBackOneURI : function() {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_URI_UP
        });
    },

    changeMediaURI : function(file, media_uri) {
        console.log("changing to: " + file.path);

        AppDispatcher.dispatch({
            type  : ActionTypes.MEDIA_URI_CHANGE,
            path  : file.path
        });

        RemoteFileActionCreator.loadFilesFromServer();
    },

    loadFilesFromServer : function() {
        console.log("requesting files from server");

        var file = RemoteFileStore.getFileData();
        var uri = UriUtils.fileToURI(file);
      
        $.getJSON(uri, function(result) {

            if (result && result.files) {
                AppDispatcher.dispatch({
                    type  : ActionTypes.MEDIA_FILES_CHANGE,
                    files : result.files
                });

            } else {
            
                AppDispatcher.dispatch({
                    type  : ActionTypes.MEDIA_REQUEST_FAILED
                });

            }
        });
    },
};

module.exports = RemoteFileActionCreator;
