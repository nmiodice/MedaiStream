var $               = require('jquery');
var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var RemoteFileStore = require('../stores/RemoteFileStore');
var FileUtils       = require('../utils/FileUtils');

var MediaDataActionCreator = {

    goBackOneURI : function() {
      AppDispatcher.dispatch({
        type : ActionTypes.MEDIA_URI_UP
      });
    },

    changeMediaURI : function(media_uri) {
      AppDispatcher.dispatch({
          type : ActionTypes.MEDIA_URI_CHANGE,
          uri  : media_uri
      });

      MediaDataActionCreator.loadFilesFromServer();
    },

    loadFilesFromServer : function() {
      console.log("requesting files from server");

      var uri = RemoteFileStore.getFileData().uri;
      
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

module.exports = MediaDataActionCreator;