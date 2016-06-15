var FileAndDirectoryStore   = require('../stores/FileAndDirectoryStore');
var DirectoryAC             = require('../actions/DirectoryAC');
var ActiveMediaPreviewStore = require('../stores/ActiveMediaPreviewStore');
var MediaPreviewAC          = require('../actions/MediaPreviewAC');

var _setFileURL = function(file, force = false) {
    var newState = file.path;
    if (window.history.state != newState || force)
        window.history.pushState(newState, "", newState);
};

var WindowHistoryUtils = {
    /**
     * Action depends on current application state:
     *  1. media preview visible --> exit media preview, stay in
     *      same navigation folder
     *  2. navigation visible --> back up a directory level
     */
    configure : function() {
        // called each time a back or forward button is pressed
        window.addEventListener("popstate", function(e) {
            var statePath = e.state == null ? "/" : e.state;
            var currFile = FileAndDirectoryStore.getFileData();

            if (ActiveMediaPreviewStore.getActiveFile() != null) {
                MediaPreviewAC.clearFile();
                // effectively cancel out the back press by pushing a new state
                _setFileURL(currFile, true);
            } else if (statePath != currFile.path) {
                DirectoryAC.setDirectory(statePath);
            }
        }.bind(this));

        // react to file changes w/ appropriate URL change
        FileAndDirectoryStore.addChangeListener(
            function() {
                _setFileURL(FileAndDirectoryStore.getFileData());
            }
        );
    }
};



module.exports = WindowHistoryUtils;
