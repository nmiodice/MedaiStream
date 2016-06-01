var EventEmitter    = require('events').EventEmitter;
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var ActionTypes     = require('../constants/ActionTypes');
var assign          = require('object-assign');
var LinkedListUtils = require('../utils/LinkedListUtils');

var CHANGE_EVENT = 'change';

var _selectedNode = null;

var _selectedFileStack = [];

var SelectedFileStore = assign({}, EventEmitter.prototype, {
    
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

    getSelectedFile : function() {
        return _selectedNode == null ? null : _selectedNode.data;
    },

    _handleRowSelected : function(action) {
        var file = action.file;
        var playlist = LinkedListUtils.fromList(file.parent.files);

        _selectedNode = LinkedListUtils.find(playlist, file);
        this.emitChange();
    },

    _handleMediaUriUpAction : function() {
        if (_selectedFileStack.length > 0) {
            _selectedNode = _selectedFileStack.pop();
            this.emitChange();
        }        
    },

    _handleMediaUriChangeAction : function() {
        _selectedFileStack.push(_selectedNode);
        _selectedNode = null;
        this.emitChange();
    },

    _handleNextRow : function() {
        if (_selectedNode != null && _selectedNode.next != null) {
            _selectedNode = _selectedNode.next;
            this.emitChange();
        }
    },

    _handlePrevRow : function() {
        if (_selectedNode != null && _selectedNode.prev != null) {
            _selectedNode = _selectedNode.prev;
            this.emitChange();
        }
    }

});

SelectedFileStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        case ActionTypes.UI_ROW_SELECTED:
            SelectedFileStore._handleRowSelected(action);
            break;

        case ActionTypes.UI_ROW_NEXT:
            SelectedFileStore._handleNextRow();
            break;

        case ActionTypes.UI_ROW_PREV:
            SelectedFileStore._handlePrevRow();
            break;
        
        case ActionTypes.URI_UP:
            SelectedFileStore._handleMediaUriUpAction();
            break;

        case ActionTypes.URI_CHANGE:
            SelectedFileStore._handleMediaUriChangeAction();
            break;
            
        default:
            break;
    }
});

module.exports = SelectedFileStore;
