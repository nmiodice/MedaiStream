var ActionTypes      = require('../constants/ActionTypes');
var AppDispatcher    = require('../dispatcher/AppDispatcher');
var ActiveMediaStore = require('../stores/ActiveMediaStore');

var ActiveMediaActionCreator = {

    setActiveMedia : function(file) {
        AppDispatcher.dispatch({
            type : ActionTypes.MEDIA_BECOMING_ACTIVE,
            file : file 
        });
    }

};

module.exports = ActiveMediaActionCreator;
