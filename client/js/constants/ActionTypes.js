var keyMirror = require('keymirror');

module.exports = keyMirror({
	MEDIA_URI_UP             : null,	// go up to parent
    MEDIA_URI_CHANGE         : null,	// load from diff. URI
    MEDIA_FILES_CHANGE       : null,	// URI's files loaded
    MEDIA_REQUEST_FAILED     : null,	// URI request failed

    MEDIA_NEW_PLAYLIST       : null,	// new song selected
    MEDIA_PLAY_STATE_TOGGLE  : null,	// pause/play
    MEDIA_NEXT_TRACK         : null,	// skip track
    MEDIA_PREV_TRACK		 : null,	// go back track
    MEDIA_VOLUME_CHANGE      : null,	// change volume
    MEDIA_SEEK               : null,    // go to track position

    UI_ROW_SELECTED          : null,    // row selected
    UI_ROW_NEXT              : null,    // row selected
    UI_ROW_PREV              : null,    // row selected
});