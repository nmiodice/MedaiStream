var React                    = require('react');
var ActiveAudioStore         = require('../../stores/ActiveAudioStore');
var ActiveAudioActionCreator = require('../../actions/ActiveAudioActionCreator');
var VolumeBar                = require('./VolumeBar.react');
var AudioInfoBar             = require('./AudioInfoBar.react');
var Mousetrap                = require('Mousetrap');

function getStateFromStores() {
    return  {
        playing     : ActiveAudioStore.getIsPlaying(),
        activeMedia : ActiveAudioStore.getActiveAudio()
    }
}

var AudioController = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveAudioStore.addChangeListener(this._onChange)
        Mousetrap.bind('space', this._onPlayPauseClick);
        Mousetrap.bind('left', this._onPrevClick);
        Mousetrap.bind('right', this._onNextClick);
    },

    componentWillUnmount: function() {
        ActiveAudioStore.removeChangeListener(this._onChange)
        Mousetrap.unbind('space');
        Mousetrap.unbind('left');
        Mousetrap.unbind('right');
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onPrevClick : function() {
        ActiveAudioActionCreator.previousTrack();
    },

    _onNextClick : function() {
        ActiveAudioActionCreator.nextTrack()
    },

    _onPlayPauseClick : function() {
        ActiveAudioActionCreator.togglePlayState();
    },

    render: function() {
        var playPauseIcon = 'img/play.png';
        var nextIcon      = 'img/next.png';
        var prevIcon      = 'img/previous.png';

        if (this.state.activeMedia == null)
            return null;

        if (this.state.playing)
            playPauseIcon = 'img/pause.png';

        return (
            <div className="footer text-center navbar-fixed-bottom media-controller container-fluid">
                <div className="col-xs-4">
                    <img 
                        className="shrink-35"
                        src={prevIcon}
                        onClick={this._onPrevClick}/>
                    
                    <img 
                        className="shrink-35"
                        src={playPauseIcon}
                        onClick={this._onPlayPauseClick}/>
                    
                    <img 
                        className="shrink-35"
                        src={nextIcon}
                        onClick={this._onNextClick}/>
                </div>
                <AudioInfoBar gridClass='col-xs-4'/>                
                <VolumeBar gridClass='col-xs-4'/>
            </div>
        );
    }

});

module.exports = AudioController;

