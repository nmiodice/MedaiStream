var FileAndDirectoryStore   = require('../stores/FileAndDirectoryStore');
var DirectoryAC             = require('../actions/DirectoryAC');


var WindowHistoryUtils = {
    configure : function() {
        window.addEventListener("popstate", function(e) {
            var statePath = e.state == null ? "/" : e.state;
            var currFilePath = FileAndDirectoryStore.getFileData().path;

            if (statePath != currFilePath) {
                DirectoryAC.setDirectory(statePath);
            }
        }.bind(this));
    },

    setFileURL : function(file) {
        var newState = file.path;
        if (window.history.state != newState)
            window.history.pushState(newState, "", newState);
    }
};

// react to file changes w/ appropriate URL change
FileAndDirectoryStore.addChangeListener(
    function() {
        WindowHistoryUtils.setFileURL(FileAndDirectoryStore.getFileData());
    }
);


module.exports = WindowHistoryUtils;
