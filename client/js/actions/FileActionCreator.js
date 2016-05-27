var $               = require('jquery');
var ActionTypes     = require('../constants/ActionTypes');
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var FileAndDirectoryStore = require('../stores/FileAndDirectoryStore');
var UriUtils        = require('../utils/UriUtils');
var FileUtils       = require('../utils/FileUtils');
var ConnectionConstants = require('../constants/ConnectionConstants');

var FileActionCreator = {

    fetchFiles : function() {
        console.log("requesting files from server");

        var parent = FileAndDirectoryStore.getFileData();
        var uri = UriUtils.directoryToURI(parent);

        $.getJSON(uri, function(result) {

            if (result && result.files) {
                AppDispatcher.dispatch({
                    type   : ActionTypes.URI_FILES_CHANGE_OR_LOAD,
                    parent : parent,
                    files  : result.files
                });

            } else {

                AppDispatcher.dispatch({
                    type  : ActionTypes.URI_REQUEST_FAILED
                });

            }
        });
    },

    filter : function(filter) {
        var currFilter = FileAndDirectoryStore.getFilter();

        // remove current filtered file
        if (currFilter != "") {
            AppDispatcher.dispatch({
                type : ActionTypes.URI_UP
            });
        }

        if (filter == "") {
            var top = FileAndDirectoryStore.getFileData();
            top.files.forEach(function(x) {
                x.parent = top;
            });
            return;
        }

        filter = filter.toLowerCase();
        // copy parent of filtered file
        var oldTop = FileAndDirectoryStore.getFileData();
        var newTop = FileAndDirectoryStore.makeFile(
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
            type      : ActionTypes.URI_CHANGE,
            path      : newTop.path,
            recursive : newTop.recursive,
            filter    : filter
        });

        AppDispatcher.dispatch({
            type   : ActionTypes.URI_FILES_CHANGE_OR_LOAD,
            parent : newTop,
            files  : newTop.files
        });
    }

};

module.exports = FileActionCreator;
