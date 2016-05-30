var $                        = require('jquery');
var React                    = require('react');
var ActiveAudioStore         = require('../../stores/ActiveAudioStore');
var ActiveAudioActionCreator = require('../../actions/ActiveAudioActionCreator');

function getStateFromStores() {
    return  {
        file     : ActiveAudioStore.getActiveAudio(),
        percComp : ActiveAudioStore.getDonePercentage(),
        pos      : ActiveAudioStore.getFilePos(),
        duration : ActiveAudioStore.getFileDuration()
    }
}

var AudioInfoBar = React.createClass({
    
    intervalID : -1,

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        this.intervalID = setInterval(this._onChange, 100);
        ActiveAudioStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActiveAudioStore.removeChangeListener(this._onChange);
        window.clearInterval(this.intervalID);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    secToFormattedTime : function(time) {
        // Hours, minutes and seconds
        var hrs  = Math.floor(time / 3600);
        var mins = Math.floor((time % 3600) / 60);
        var secs = Math.floor(time % 60); 

        if (isNaN(hrs))
            hrs = 0;
        if (isNaN(mins))
            mins = 0;
        if (isNaN(secs))
            secs = 0;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0)
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    },

    _onProgressClick : function(event) {
        var elem = $(event.target);
        var display = elem.find('.display');

        var off = event.clientX - elem.offset().left;
        var offPercent = off / elem.width();
        var seekPos = offPercent * this.state.duration;
        ActiveAudioActionCreator.setSeekPosition(seekPos)
    },

    render: function() {
        var cName = this.props.gridClass + ' audio-info-bar';
        var lTime = this.secToFormattedTime(this.state.pos);
        var rTime = this.secToFormattedTime(this.state.duration - this.state.pos);

        return (
            <div className={cName}>
                <div className="inline float-left small-text">{lTime}</div>
                <div className="inline float-right small-text">{rTime}</div>
                <progress 
                    onClick={this._onProgressClick}
                    className="audio-progress-bar" 
                    value={this.state.percComp} 
                    max="100"/>

            </div>
        );
    }

});

module.exports = AudioInfoBar;

