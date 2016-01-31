var React        = require('react');
var ActiveMediaStore = require('../stores/ActiveMediaStore');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');
var VolumeBar = require('./VolumeBar.react')

function getStateFromStores() {
    return  {
        playing     : ActiveMediaStore.getIsPlaying(),
        activeMedia : ActiveMediaStore.getActiveMedia()
    }
}

var MediaController = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveMediaStore.addChangeListener(this._onChange)
    },

    componentWillUnmount: function() {
        ActiveMediaStore.removeChangeListener(this._onChange)
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onPrevClick : function() {
        ActiveMediaActionCreator.previousTrack();
    },

    _onNextClick : function() {
        ActiveMediaActionCreator.nextTrack()
    },

    _onPlayPauseClick : function() {
        ActiveMediaActionCreator.togglePlayState();
    },

    render: function() {
        var file = this.props.file;
        var playPauseIcon = 'img/play.png';
        var nextIcon      = 'img/next.png';
        var prevIcon      = 'img/previous.png';

        if (this.state.activeMedia == null)
            return null;

        if (this.state.playing)
            playPauseIcon = 'img/pause.png';

        return (
            <div className="footer text-center navbar-fixed-bottom media-controller container-fluid">
                <img 
                    className="img-inverse shrink-65" 
                    src={prevIcon}
                    onClick={this._onPrevClick}/>
                
                <img 
                    className="img-inverse shrink-65" 
                    src={playPauseIcon}
                    onClick={this._onPlayPauseClick}/>
                
                <img 
                    className="img-inverse shrink-65" 
                    src={nextIcon}
                    onClick={this._onNextClick}/>
                <VolumeBar/>                
            </div>
        );
    }

});

module.exports = MediaController;

