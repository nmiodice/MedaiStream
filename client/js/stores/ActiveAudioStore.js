var EventEmitter    = require('events').EventEmitter;
var AppDispatcher   = require('../dispatcher/AppDispatcher');
var ActionTypes     = require('../constants/ActionTypes');
var assign          = require('object-assign');
var Howler          = require('howler')
var UriUtils        = require('../utils/UriUtils')
var LinkedListUtils = require('../utils/LinkedListUtils')


var CHANGE_EVENT = 'change';

var _activeAudioNode = null;

var _isPlaying = false;

var _sound = null;

var _soundID = null;

var _volume = 0.5;

var ActiveAudioStore = assign({}, EventEmitter.prototype, {
    
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

    getActiveAudio : function() {
        return _activeAudioNode == null ? null : _activeAudioNode.data;
    },

    getIsPlaying : function() {
        return _isPlaying;
    },

    getVolume : function() {
        return _volume;
    },

    getDonePercentage : function() {
        var progress = 0;
        if (_sound != null && _sound.duration() > 0) {
            progress = _sound.seek() / _sound.duration();
        }
        return progress * 100;
    },

    getFilePos : function() {
        return _sound == null ? 0 : _sound.seek();
    },

    getFileDuration : function() {
        return _sound == null ? 0 : _sound.duration();
    },

    _setPlayListFromFile : function(active) {
        var playlist = LinkedListUtils.fromList(active.parent.files)

        _activeAudioNode = LinkedListUtils.find(playlist, active);
        console.log(_activeAudioNode);
    },

    _playFromCurrentTrack : function() {
        console.log(_sound)
        if (_sound) {
            _sound.stop();
            _sound.unload();

            _sound = null;
            _soundID = null;
        }
        var uri = UriUtils.fileToURI(_activeAudioNode.data);
        console.log('Howler trying to load: ' + uri);

        _sound = new Howl({
            src     : [uri],
            volume  : _volume,
            onend   : function() {
                _isPlaying = false;
                ActiveAudioStore._handleNextTrack()
            },
            onload  : function() {
                _soundID = _sound.play();
                _isPlaying = true;
                ActiveAudioStore.emitChange();
            },
            onloaderror : function() {
                alert('Failed to load media file');
                _sound = null;
                _isPlaying = false;
                _activeAudioNode = null;
                ActiveAudioStore.emitChange();
            }
        });

    },

    _handleAudioBecomingActive : function(action) {
        ActiveAudioStore._setPlayListFromFile(action.file);
        ActiveAudioStore._playFromCurrentTrack();
    },

    _handleAudioPlayStateToggle : function(action) {
        if (_sound == null) 
            return;

        if (_isPlaying)
            _sound.pause(_soundID);
        else
            _sound.play(_soundID);
        
        _isPlaying = !_isPlaying;
        ActiveAudioStore.emitChange();
    },

    _handleNextTrack : function() {
        if (_activeAudioNode != null && _activeAudioNode.next != null) {
            _activeAudioNode = _activeAudioNode.next;
            ActiveAudioStore._playFromCurrentTrack();
        }
        ActiveAudioStore.emitChange();
    },

    _handlePrevTrack : function() {
        if (_activeAudioNode != null && _activeAudioNode.prev != null) {
            _activeAudioNode = _activeAudioNode.prev;
            ActiveAudioStore._playFromCurrentTrack();
        }
        ActiveAudioStore.emitChange();
    },

    _handleVolumeChange : function(action) {
        _volume = action.volume;
        
        if (_sound) {
            _sound.volume(_volume);
        }
        ActiveAudioStore.emitChange();
    },

    _handleSeek : function(event) {
        if (_sound) {
            _sound.seek(event.time);
        }
    }

});

ActiveAudioStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
        
        case ActionTypes.MEDIA_NEW_PLAYLIST:
            ActiveAudioStore._handleAudioBecomingActive(action);
            break;

        case ActionTypes.MEDIA_PLAY_STATE_TOGGLE:
            ActiveAudioStore._handleAudioPlayStateToggle(action);
            break;

        case ActionTypes.MEDIA_NEXT_TRACK:
            ActiveAudioStore._handleNextTrack();
            break;

        case ActionTypes.MEDIA_PREV_TRACK:
            ActiveAudioStore._handlePrevTrack();
            break;

        case ActionTypes.MEDIA_VOLUME_CHANGE:
            ActiveAudioStore._handleVolumeChange(action);
            break;

        case ActionTypes.MEDIA_SEEK:
            ActiveAudioStore._handleSeek(action);
            break;

        default:
            break;
    }
});

ActiveAudioStore.setMaxListeners(0);
module.exports = ActiveAudioStore;
