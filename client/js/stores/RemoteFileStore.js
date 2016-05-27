var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');
var ServerConstants     = require('../constants/ServerConstants');
var ConnectionConstants = require('../constants/ConnectionConstants');
var FileUtils           = require('../utils/FileUtils');

var CHANGE_EVENT = 'change';


var RemoteFileStore = assign({}, EventEmitter.prototype, {

    makeFile : function(status, path, files, isRecursive) {
        return {
            status : status,
            path   : path,
            files  : files,
            recursive : isRecursive
        }
    },
    
    emitChange : function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener : function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener : function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getFileData : function() {
        return getHead(_fileStack);
    },

    getFilter : function() {
        return _filter;
    },

    getFileStackSize : function() {
        return _fileStack.length;
    },

    _handleMediaUriUpAction : function(action) {
        if (_fileStack.length > 1) {
            _fileStack.pop();
            _filter = "";
            RemoteFileStore.emitChange();
        }
    },

    _handleMediaUriChangeAction : function(action) {

        _fileStack.push(RemoteFileStore.makeFile(
            ConnectionConstants.CONNECTING,
            action.path,
            [],
            action.recursive ? true : false
        ));

        _filter = action.filter;
        RemoteFileStore.emitChange();
    },

    _handleMediaFilesChangeAction : function(action) {
        var fileData = getHead(_fileStack);

        fileData.status = ConnectionConstants.ONLINE;
        fileData.files  = action.files;

        fileData.files.forEach(function(x) {
            x.parent = action.parent;
        });

        RemoteFileStore.emitChange();
    },

    _handleRequestFailedAction : function(action) {
        var fileData = getHead(_fileStack);

        fileData.files  = [];
        fileData.status = ConnectionConstants.OFFLINE;
        RemoteFileStore.emitChange();
    },

});

var _fileStack = [RemoteFileStore.makeFile(ConnectionConstants.OFFLINE, '/', [], 0)];

var _filter = "";

var getHead = function(stack) {
    if (stack.length == 0)
        return null;
    return stack[stack.length - 1]
};


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
