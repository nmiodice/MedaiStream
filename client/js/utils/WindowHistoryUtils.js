var FileAndDirectoryStore   = require('../stores/FileAndDirectoryStore');
var DirectoryAC             = require('../actions/DirectoryAC');
var ActiveMediaPreviewStore = require('../stores/ActiveMediaPreviewStore');
var MediaPreviewAC          = require('../actions/MediaPreviewAC');
var ServerConstants         = require('../constants/ServerConstants');
var FileUtils               = require('./FileUtils');

var PREVIEW_CONSTANT = 'preview'

var _fileToHistoryDisplay = function(file, activeMediaFile) {
    var queryParam = activeMediaFile == null ?
        "" : "?" + PREVIEW_CONSTANT + '=' + FileUtils.fileToDisplayString(activeMediaFile);
    return ServerConstants.DIRECTORY_WILDCARD_PATH + file.path + queryParam;
};

var _fileToHistoryState = function(file, activeMediaFile) {
    return {
        path: file.path,
        media: activeMediaFile
    };
};

var _setFileURL = function(file, activeMediaFile = null) {
    var newState = _fileToHistoryState(file, activeMediaFile);
    var oldState = window.history.state;

    var isNew = newState.path != oldState.path || newState.media != oldState.media;
    if (isNew) {
        window.history.pushState(
            newState,
            "",
            _fileToHistoryDisplay(file, activeMediaFile));
    }
};

var _replaceFileURL = function(file) {
    window.history.replaceState(
        _fileToHistoryState(file, null),
        "",
        _fileToHistoryDisplay(file, null));
};

var _getDirectoryFromWindow = function() {
    var ss = decodeURI(window.location.pathname);
    if (ss.indexOf(ServerConstants.DIRECTORY_WILDCARD_PATH) != 0)
        return null;
    ss = ss.replace(ServerConstants.DIRECTORY_WILDCARD_PATH, "");
    ss = ss == '' ? '/' : ss;
    return ss;
};

var _getMediaFileFromWindow = function() {
    var query = decodeURI(window.location.search).replace('?', '');
    return query == '' ? null : query.split('=')[1];
};

var _popStateEvent = function(e) {
    var statePath = e.state == null ? "/" : e.state.path;
    var mediaFile = e.state == null ? null : e.state.media;

    var currFile = FileAndDirectoryStore.getFileData();

    if (ActiveMediaPreviewStore.getActiveFile() != null && mediaFile == null) {
        MediaPreviewAC.clearFile();
    }

    if (statePath != currFile.path) {
        DirectoryAC.setDirectory(statePath);
    }

    if (mediaFile != null) {
        MediaPreviewAC.setFile(mediaFile);
    }
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
        var currMediaFilePath = _getMediaFileFromWindow();
        var currDirectoryPath = _getDirectoryFromWindow();

        console.log('Configuring initial page state with directory path and active media file: ',
            currDirectoryPath,
            currMediaFilePath);

        // on load, reset the actual directory with the proper one
        if (currDirectoryPath != null && currDirectoryPath != FileAndDirectoryStore.getFileData().path)
            DirectoryAC.setDirectory(currDirectoryPath);

        _replaceFileURL(FileAndDirectoryStore.getFileData());

        // called each time a back or forward button is pressed
        window.addEventListener("popstate", _popStateEvent);

        // react to file changes w/ appropriate URL change
        FileAndDirectoryStore.addChangeListener(function() {
            var currDirectoryFile = FileAndDirectoryStore.getFileData();

            _setFileURL(currDirectoryFile);

            // if there was a media preview active, react to it. this should ONLY
            // happen if the user reloads the page with a media preview active. In
            // this case, it should only happen during the initial page load
            if (currMediaFilePath != null) {
                currDirectoryFile.files.forEach(function(x) {
                    if (FileUtils.fileToDisplayString(x) == currMediaFilePath) {
                        // Run after dispatcher has finished -- very big hack!
                        setTimeout(function() {
                            MediaPreviewAC.setFile(x);
                            currMediaFilePath = null;
                        }, 0);
                    }
                });
            }
        });

        // react to preview coming available
        ActiveMediaPreviewStore.addChangeListener(function() {
            // prevents resetting the URL if the media was changed
            // due to a `popstate` event being called
            var setFile =
                ActiveMediaPreviewStore.getActiveFile() == null ||
                FileUtils.fileToDisplayString(ActiveMediaPreviewStore.getActiveFile()) != _getMediaFileFromWindow();

            if (setFile) {
                _setFileURL(
                    FileAndDirectoryStore.getFileData(),
                    ActiveMediaPreviewStore.getActiveFile());
            }
        });
    }
};



module.exports = WindowHistoryUtils;
