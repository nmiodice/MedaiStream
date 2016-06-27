var FileAndDirectoryStore   = require('../stores/FileAndDirectoryStore');
var DirectoryAC             = require('../actions/DirectoryAC');
var ActiveMediaPreviewStore = require('../stores/ActiveMediaPreviewStore');
var MediaPreviewAC          = require('../actions/MediaPreviewAC');
var ServerConstants         = require('../constants/ServerConstants');

var _fileToDisplayString = function(file) {
    return ServerConstants.DIRECTORY_WILDCARD_PATH + file.path;
};

var _fileToStateString = function(file) {
    return file.path;
};

var _setFileURL = function(file, force = false) {
    if (window.history.state != _fileToStateString(file) || force)
        window.history.pushState(_fileToStateString(file), "", _fileToDisplayString(file));
};

var _replaceFileURL = function(file) {
    window.history.replaceState(_fileToStateString(file), "", _fileToDisplayString(file));
};

var _displayStringToDirectory = function(ss) {
    ss = decodeURI(ss);
    if (ss.indexOf(ServerConstants.DIRECTORY_WILDCARD_PATH) != 0)
        return null;
    return ss.replace(ServerConstants.DIRECTORY_WILDCARD_PATH, "");
};

var WindowHistoryUtils = {
    /**
     * Action depends on current application state:
     *  1. replace state with DIRECTORY_WILDCARD_PATH
     *  2. media preview visible --> exit media preview, stay in
     *      same navigation folder
     *  3. navigation visible --> back up a directory level
     */
    configure : function() {
        var currPath = _displayStringToDirectory(window.location.pathname);
        if (currPath != null)
            DirectoryAC.setDirectory(currPath);

        _replaceFileURL(FileAndDirectoryStore.getFileData());

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
