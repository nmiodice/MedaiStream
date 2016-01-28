var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');
var howler       = require('howler')
var UriUtils     = require('../utils/UriUtils')
var LinkedListUtils     = require('../utils/LinkedListUtils')
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');


var CHANGE_EVENT = 'change';

var _activeMediaNode = null;

var _isPlaying = false;

var _sound = null;

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
        return _activeMediaNode == null ? null : _activeMediaNode.data;
    },

    getIsPlaying : function() {
        return _isPlaying;
    },

    _setPlayListFromFile : function(active) {
        var playlist = LinkedListUtils.fromList(active.parent.files)

        _activeMediaNode = LinkedListUtils.find(playlist, active);
    },

    _playFromCurrentTrack : function() {
        if (_sound) {
            _sound.stop();
            _sound.unload();
        }

        _sound = new Howl({
            urls  : [UriUtils.fileToURI(_activeMediaNode.data)],
            onend : function() {
                ActiveMediaStore._handleNextTrack();
            }
        }).play();
        _isPlaying = true;        
    },

    _handleMediaBecomingActive : function(action) {
        ActiveMediaStore._setPlayListFromFile(action.file);
        ActiveMediaStore._playFromCurrentTrack();
        ActiveMediaStore.emitChange();
    },

    _handleMediaPlayStateTogge : function(action) {
        if (_sound == null) 
            return;

        if (_isPlaying)
            _sound.pause();
        else
            _sound.play();
        
        _isPlaying = !_isPlaying;
        ActiveMediaStore.emitChange();  
    },

    _handleNextTrack : function() {
        if (_activeMediaNode != null && _activeMediaNode.next != null) {
            _activeMediaNode = _activeMediaNode.next;
            ActiveMediaStore._playFromCurrentTrack();
        }
    },

    _handlePrevTrack : function() {
        if (_activeMediaNode != null && _activeMediaNode.prev != null) {
            _activeMediaNode = _activeMediaNode.prev;
            ActiveMediaStore._playFromCurrentTrack();
        }
    }

});

ActiveMediaStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        
        case ActionTypes.MEDIA_NEW_PLAYLIST:
            ActiveMediaStore._handleMediaBecomingActive(action);
            break;

        case ActionTypes.MEDIA_PLAY_STATE_TOGGLE:
            ActiveMediaStore._handleMediaPlayStateTogge(action);
            break;

        case ActionTypes.MEDIA_NEXT_TRACK:
            ActiveMediaStore._handleNextTrack();
            break;

        case ActionTypes.MEDIA_PREV_TRACK:
            ActiveMediaStore._handlePrevTrack();
            break;

        default:
            break;
    }
});

module.exports = ActiveMediaStore;
