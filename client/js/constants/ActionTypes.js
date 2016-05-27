var keyMirror = require('keymirror');

module.exports = keyMirror({
	URI_UP                   : null,	// go up to parent
    URI_CHANGE               : null,	// load from diff. URI
    URI_FILES_CHANGE_OR_LOAD     : null,	// URI's files loaded
    URI_REQUEST_FAILED       : null,	// URI request failed

    AUDIO_NEW_PLAYLIST       : null,	// new song selected
    AUDIO_PLAY_STATE_TOGGLE  : null,	// pause/play
    AUDIO_NEXT_TRACK         : null,	// skip track
    AUDIO_PREV_TRACK		 : null,	// go back track
    AUDIO_VOLUME_CHANGE      : null,	// change volume
    AUDIO_SEEK               : null,    // go to track position

    UI_ROW_SELECTED          : null,    // row selected
    UI_ROW_NEXT              : null,    // row selected
    UI_ROW_PREV              : null     // row selected
});