
var WindowHistoryUtils = {
    pushFileURL : function(file) {
        var newState = file.path;
        var oldState = window.history.state;
        if (oldState != newState)
            window.history.pushState(newState, "", newState);
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
