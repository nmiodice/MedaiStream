var React        = require('react');
var ActiveMediaStore = require('../stores/ActiveMediaStore');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');

function getStateFromStores() {
    return  {
        playing : ActiveMediaStore.getIsPlaying()
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

    _onVolumeClick : function()  {
        alert('implement!');
    },

    render: function() {
        var file = this.props.file;
        var playPauseIcon = 'img/play.png';
        var volumeIcon    = 'img/volume.png';
        var nextIcon      = 'img/next.png';
        var prevIcon      = 'img/previous.png';

        if (this.state.playing)
            playPauseIcon = 'img/pause.png';

        return (
            <div className="footer text-center navbar-fixed-bottom media-controller .container-fluid">
                <img 
                    className="img-inverse col-xs-4." 
                    src={prevIcon}
                    onClick={this._onPrevClick}/>
                
                <img 
                    className="img-inverse col-xs-4." 
                    src={playPauseIcon}
                    onClick={this._onPlayPauseClick}/>
                
                <img 
                    className="img-inverse col-xs-4." 
                    src={nextIcon}
                    onClick={this._onNextClick}/>
                
                <img 
                    className="img-inverse col-xs-4." 
                    src={volumeIcon}
                    onClick={this._onVolumeClick}/>
            </div>
        );
    }

});

module.exports = MediaController;

