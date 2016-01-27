var React        = require('react');
var howler       = require('howler')
var UriUtils     = require('../utils/UriUtils')
var ActiveMediaStore = require('../stores/ActiveMediaStore');

function getStateFromStores() {
    return  {
        file : ActiveMediaStore.getActiveMedia(),
    }
}

var sound = null;

var MediaPlayer = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveMediaStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        sound.stop();
        ActiveMediaStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    render: function() {
        var fileData = this.state.file;

        if (!fileData == null || fileData == null) return (null);

        if (sound) sound.unload();

        sound = new Howl({
            urls: [UriUtils.fileToURI(fileData)]
        }).play();

        return (
            <div className="footer text-center navbar-fixed-bottom">
            MEDIA FOUND!
            </div>
        );
    }

});

module.exports = MediaPlayer;

