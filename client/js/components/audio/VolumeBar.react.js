var React             = require('react');
var ActiveAudioStore  = require('../../stores/ActiveAudioStore');
var ActiveAudioAC     = require('../../actions/ActiveAudioAC');


function getStateFromStores() {
    return  {
        volume: ActiveAudioStore.getVolume()
    }
}

var VolumeBar = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveAudioStore.addChangeListener(this._onChange)
    },

    componentWillUnmount: function() {
        ActiveAudioStore.removeChangeListener(this._onChange)
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onVolumeChange : function(event) {
        var volume = event.target.value / 100.0;
        this._setVolume(volume);
    },

    _onMute : function() {
        this._setVolume(0.0);
    },

    _onMax : function() {
        this._setVolume(1.0);
    },

    _setVolume : function(volume) {
        ActiveAudioAC.setVolume(volume);
    },

    render: function() {
        var volUp    = 'assets/img/volume-high.png';
        var volDown  = 'assets/img/volume-low.png';
        var volume   = this.state.volume;
        var cName = this.props.gridClass;

        return (
            <div className={cName}>
                <img 
                    className="shrink-35"
                    src={volDown}
                    onClick={this._onMute}/>

                <div className="inline">
                    <input 
                        type="range"  
                        min="0" 
                        max="100" 
                        value={volume * 100}
                        onChange={this._onVolumeChange}/>
                </div>
                
                <img 
                    className="shrink-35"
                    src={volUp}
                    onClick={this._onMax}/>

            </div>
        );
    }

});

module.exports = VolumeBar;

