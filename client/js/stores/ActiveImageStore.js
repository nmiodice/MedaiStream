var EventEmitter    = require('events').EventEmitter;
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var ActionTypes     = require('../constants/ActionTypes');
var assign          = require('object-assign');


var CHANGE_EVENT = 'change';

var _imageFile = null;

var ActiveImageStore = assign({}, EventEmitter.prototype, {

    emitChange : function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener : function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener : function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getActiveImage : function() {
        return _imageFile;
    },

    _handleImageActive : function(action) {
        _imageFile = action.file;
        this.emitChange();
    },

    _handleImageClear : function() {
        _imageFile = null;
        this.emitChange();
    }

});

ActiveImageStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {

        case ActionTypes.IMAGE_ACTIVE:
            ActiveImageStore._handleImageActive(action);
            break;

        case ActionTypes.IMAGE_CLEAR:
            ActiveImageStore._handleImageClear();
            break;

        default:
            break;
    }
});

module.exports = ActiveImageStore;
