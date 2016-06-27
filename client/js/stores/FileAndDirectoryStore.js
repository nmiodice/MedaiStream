var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');
var ServerConstants     = require('../constants/ServerConstants');
var ConnectionConstants = require('../constants/ConnectionConstants');
var FileUtils           = require('../utils/FileUtils');

var CHANGE_EVENT = 'change';

var _makeFile = function(status, path, files, isRecursive) {
    return {
        status : status,
        path   : path,
        files  : files,
        recursive : isRecursive
    }
};

var _fileData = _makeFile(ConnectionConstants.OFFLINE, '/', [], 0);

var _fileCache = {};
_fileCache[_fileData.path] = _fileData;


var _filter = "";


var FileAndDirectoryStore = assign({}, EventEmitter.prototype, {
    
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
        return _fileData;
    },

    getFilter : function() {
        return _filter;
    },

    makeFile : function(status, path, files, isRecursive) {
        return _makeFile(status, path, files, isRecursive);
    },

    _handleMediaUriUpAction : function() {
        // if there is a filter, remove it. the back action
        // should just remove the filter in this case
        if (_filter != "") {
            _filter = "";
            _fileData = _fileCache[_fileData.path];
        } else {
            var path = _fileData.path;
            var parts = path.split('/');
            var newPath;

            if (parts.length > 1) {
                parts.pop();
                newPath = parts.join('/');

                if (newPath == '')
                    newPath = '/';

                // a good cached value is one that is in the cache and has at some point
                // been loaded from the server. under some circumstances, paths may not
                // ever load fully from the server, and the cached value is incomplete
                var isCached = newPath in _fileCache;
                isCached = isCached && _fileCache[newPath].status == ConnectionConstants.ONLINE;

                if (isCached) {
                    _fileData = _fileCache[newPath];
                } else {
                    _fileData = _makeFile(ConnectionConstants.NEEDS_LOAD, newPath, [], 0);
                }
            }
        }

        FileAndDirectoryStore.emitChange();
    },

    _handleMediaUriChangeAction : function(action) {
        // easier to not use the hashed data when moving down
        // the file system tree.
        //  TODO: future improvement to use the cache!
        _fileData = _makeFile(
            ConnectionConstants.CONNECTING,
            action.path,
            [],
            action.recursive ? true : false
        );

        if (action.filter == "")
            _fileCache[_fileData.path] = _fileData;

        _filter = action.filter;
        FileAndDirectoryStore.emitChange();
    },

    _handleMediaFilesChangeAction : function(action) {
        _fileData.status = ConnectionConstants.ONLINE;
        _fileData.files  = action.files;

        _fileData.files.forEach(function(x) {
            x.parent = action.parent;
        });

        FileAndDirectoryStore.emitChange();
    },

    _handleRequestFailedAction : function() {
        _fileData.files  = [];
        _fileData.status = ConnectionConstants.OFFLINE;
        FileAndDirectoryStore.emitChange();
    }

});


FileAndDirectoryStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        case ActionTypes.URI_UP:
            FileAndDirectoryStore._handleMediaUriUpAction();
            break;

        case ActionTypes.URI_CHANGE:
            console.log("uri change", Date.now());
            FileAndDirectoryStore._handleMediaUriChangeAction(action);
            break;

        case ActionTypes.URI_FILES_CHANGE_OR_LOAD:
            console.log("uri loaded", Date.now());
            FileAndDirectoryStore._handleMediaFilesChangeAction(action);
            break;

        case ActionTypes.URI_REQUEST_FAILED:
            FileAndDirectoryStore._handleRequestFailedAction();
            break;

        default:
            break;
    }
});

module.exports = FileAndDirectoryStore;
