var EventEmitter        = require('events').EventEmitter;
var AppDispatcher       = require('../dispatcher/AppDispatcher');
var ActionTypes         = require('../constants/ActionTypes');
var assign              = require('object-assign');
var Howler       = require('howler')
var UriUtils     = require('../utils/UriUtils')
var LinkedListUtils     = require('../utils/LinkedListUtils')


var CHANGE_EVENT = 'change';

var _activeMediaNode = null;

var _isPlaying = false;

var _sound = null;

var _soundID = null;

var _volume = 0.5;

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

    getVolume : function() {
        return _volume;
    },

    _setPlayListFromFile : function(active) {
        var playlist = LinkedListUtils.fromList(active.parent.files)

        _activeMediaNode = LinkedListUtils.find(playlist, active);
        console.log(_activeMediaNode);
    },

    _playFromCurrentTrack : function() {
        console.log(_sound)
        if (_sound) {
            _sound.stop();
            _sound.unload();

            _sound = null;
            _soundID = null;
        }
        var uri = UriUtils.fileToURI(_activeMediaNode.data);
        _sound = new Howl({
            // html5   : true,  // faster, but some songs don't trigger 'onend' properly
            src     : [uri],
            volume  : _volume,
            onend   : function() {
                _isPlaying = false;
                ActiveMediaStore._handleNextTrack()
            },
            onload  : function() {
                _soundID = _sound.play();
                _isPlaying = true;
                ActiveMediaStore.emitChange();
            },
            onloaderror : function() {
                _sound = null;
                _isPlaying = false;
                ActiveMediaStore.emitChange();
            }
        });

    },

    _handleMediaBecomingActive : function(action) {
        ActiveMediaStore._setPlayListFromFile(action.file);
        ActiveMediaStore._playFromCurrentTrack();
    },

    _handleMediaPlayStateTogge : function(action) {
        if (_sound == null) 
            return;

        if (_isPlaying)
            _sound.pause(_soundID);
        else
            _sound.play(_soundID);
        
        _isPlaying = !_isPlaying;
        ActiveMediaStore.emitChange();  
    },

    _handleNextTrack : function() {
        if (_activeMediaNode != null && _activeMediaNode.next != null) {
            _activeMediaNode = _activeMediaNode.next;
            ActiveMediaStore._playFromCurrentTrack();
        }
        ActiveMediaStore.emitChange();
    },

    _handlePrevTrack : function() {
        if (_activeMediaNode != null && _activeMediaNode.prev != null) {
            _activeMediaNode = _activeMediaNode.prev;
            ActiveMediaStore._playFromCurrentTrack();
        }
        ActiveMediaStore.emitChange();
    },

    _handleVolumeChange : function(action) {
        _volume = action.volume;
        
        if (_sound) {
            _sound.volume(_volume);
        }
        ActiveMediaStore.emitChange();
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

        case ActionTypes.MEDIA_VOLUME_CHANGE:
            ActiveMediaStore._handleVolumeChange(action);
            break;

        default:
            break;
    }
});

ActiveMediaStore.setMaxListeners(0);
module.exports = ActiveMediaStore;
