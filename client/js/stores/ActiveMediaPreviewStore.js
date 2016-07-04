var EventEmitter     = require('events').EventEmitter;
var AppDispatcher    = require('../dispatcher/AppDispatcher');
var ActionTypes      = require('../constants/ActionTypes');
var assign           = require('object-assign');
var LinkedListUtils  = require('../utils/LinkedListUtils');

var CHANGE_EVENT = 'change';

var _previewFileNode = null;


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
        return _previewFileNode == null ? null :_previewFileNode.data;
    },

    getActiveFilePositionData : function() {
        return _previewFileNode == null ? null :
        {
            position : _previewFileNode.position,
            total : _previewFileNode.metadata.listSize
        };
    },

    _handlePreviewActive : function(action) {
        var previewList = LinkedListUtils.fromList(action.file.parent.files);
        _previewFileNode = LinkedListUtils.find(previewList, action.file);
        this.emitChange();
    },

    _handlePreviewClear : function() {
        _previewFileNode = null;
        this.emitChange();
    },

    _handlePreviewNext : function() {
        if (_previewFileNode == null || _previewFileNode.next == null)
            return;
        _previewFileNode = _previewFileNode.next;
        this.emitChange();
    },

    _handlePreviewPrevious : function() {
        if (_previewFileNode == null || _previewFileNode.prev == null)
            return;
        _previewFileNode = _previewFileNode.prev;
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

        case ActionTypes.PREVIEW_NEXT:
            ActiveMediaPreviewStore._handlePreviewNext();
            break;

        case ActionTypes.PREVIEW_PREV:
            ActiveMediaPreviewStore._handlePreviewPrevious();
            break;

        default:
            break;
    }
});

module.exports = ActiveMediaPreviewStore;
