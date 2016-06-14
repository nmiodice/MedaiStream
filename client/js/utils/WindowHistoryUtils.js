
var WindowHistoryUtils = {
    pushFileURL : function(file) {
        var state = file.path;
        window.history.pushState(state, "", state);
    },

    replaceFileURL : function(file) {
        var state = file.path;
        window.history.replaceState(state, "", state);    },

    popFileURL : function() {
        window.history.back();
    },

    getCurrentURL : function() {
        return window.history.state;
    }
};

module.exports = WindowHistoryUtils;
