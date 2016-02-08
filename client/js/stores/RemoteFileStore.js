var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');
var ServerConstants     = require('../constants/ServerConstants');
var ConnectionConstants = require('../constants/ConnectionConstants');

var CHANGE_EVENT = 'change';

var _fileData = {
    status : ConnectionConstants.OFFLINE,
    path   : ServerConstants.MEDIA_HOME_BASE,
    files  : []
};

var _fileStack = []

var RemoteFileStore = assign({}, EventEmitter.prototype, {
    
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

    getFileData : function() {
        return _fileData;
    },

    getFileStackSize : function() {
        return _fileStack.length;
    },

    _handleMediaUriUpAction : function(action) {
        if (_fileStack.length > 0) {
            _fileData = _fileStack.pop();
            RemoteFileStore.emitChange();
        }        
    },

    _handleMediaUriChangeAction : function(action) {
        _fileStack.push(_fileData);
        
        _fileData        = {};
        _fileData.status = ConnectionConstants.CONNECTING;
        _fileData.path   = action.path;
        _fileData.files  = [];
        _fileData.recursive = action.recursive ? true : false;
        
        RemoteFileStore.emitChange();
    },

    _handleMediaFilesChangeAction : function(action) {
        _fileData.status = ConnectionConstants.ONLINE;
        _fileData.files  = action.files;

        _fileData.files.forEach(function(x) {
            x.parent = action.parent;
        });

        RemoteFileStore.emitChange();
    },

    _handleRequestFailedAction : function(action) {
        _fileData.files  = [];
        _fileData.status = ConnectionConstants.OFFLINE;
        RemoteFileStore.emitChange();
    }

});

RemoteFileStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        case ActionTypes.MEDIA_URI_UP:
            RemoteFileStore._handleMediaUriUpAction(action);
            break;

        case ActionTypes.MEDIA_URI_CHANGE:
            RemoteFileStore._handleMediaUriChangeAction(action);
            break;

        case ActionTypes.MEDIA_FILES_CHANGE:
            RemoteFileStore._handleMediaFilesChangeAction(action);
            break;

        case ActionTypes.MEDIA_REQUEST_FAILED:
            RemoteFileStore._handleRequestFailedAction(action);
            break;

        default:
            break;
    }
});

module.exports = RemoteFileStore;
