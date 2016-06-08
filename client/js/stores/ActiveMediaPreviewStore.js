var EventEmitter     = require('events').EventEmitter;
var AppDispatcher    = require('../dispatcher/AppDispatcher');
var ActionTypes      = require('../constants/ActionTypes');
var assign           = require('object-assign');


var CHANGE_EVENT = 'change';

var _previewFile = null;


var ActiveMediaPreviewStore = assign({}, EventEmitter.prototype, {

    emitChange : function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener : function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener : function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getActiveFile : function() {
        return _previewFile;
    },

    _handlePreviewActive : function(action) {
        _previewFile = action.file;
        this.emitChange();
    },

    _handlePreviewClear : function() {
        _previewFile = null;
        this.emitChange();
    }

});

ActiveMediaPreviewStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {

        case ActionTypes.PREVIEW_ACTIVE:
            ActiveMediaPreviewStore._handlePreviewActive(action);
            break;

        case ActionTypes.PREVIEW_CLEAR:
            ActiveMediaPreviewStore._handlePreviewClear();
            break;

        default:
            break;
    }
});

module.exports = ActiveMediaPreviewStore;
