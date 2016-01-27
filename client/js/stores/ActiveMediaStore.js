var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');

var CHANGE_EVENT = 'change';

var _activeMedia = null;

var ActiveMediaStore = assign({}, EventEmitter.prototype, {
    
    emitChange : function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener : function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener : function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getActiveMedia : function() {
        return _activeMedia;
    },

    _handleMediaBecomingActive : function(action) {
        // alert("implement!");
        _activeMedia = action.file;
        ActiveMediaStore.emitChange();
    }

});

ActiveMediaStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        case ActionTypes.MEDIA_BECOMING_ACTIVE:
            ActiveMediaStore._handleMediaBecomingActive(action);
            break;

        default:
            break;
    }
});

module.exports = ActiveMediaStore;
