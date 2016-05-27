var $               = require('jquery');
var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var RemoteFileStore = require('../stores/RemoteFileStore');
var UriUtils        = require('../utils/UriUtils');
var FileUtils       = require('../utils/FileUtils');
var ConnectionConstants = require('../constants/ConnectionConstants');

var FileActionCreator = {

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

    filter : function(filter) {
        var currFilter = RemoteFileStore.getFilter();

        // remove current filtered file
        if (currFilter != "") {
            AppDispatcher.dispatch({
                type : ActionTypes.MEDIA_URI_UP
            });
        }

        if (filter == "") {
            var top = RemoteFileStore.getFileData();
            top.files.forEach(function(x) {
                x.parent = top;
            });
            return;
        }

        filter = filter.toLowerCase();
        // copy parent of filtered file
        var oldTop = RemoteFileStore.getFileData();
        var newTop = RemoteFileStore.makeFile(
            ConnectionConstants.ONLINE,
            oldTop.path,
            [],
            oldTop.recursive
        );

        // filter files
        oldTop.files.forEach(function(x) {
            var name = FileUtils.fileToDisplayString(x).toLowerCase();
            if (name.indexOf(filter) > -1) {
                newTop.files.push(x);
            }
        });


        AppDispatcher.dispatch({
            type      : ActionTypes.MEDIA_URI_CHANGE,
            path      : newTop.path,
            recursive : newTop.recursive,
            filter    : filter
        });

        AppDispatcher.dispatch({
            type   : ActionTypes.MEDIA_FILES_CHANGE,
            parent : newTop,
            files  : newTop.files
        });
    }

};

module.exports = FileActionCreator;
