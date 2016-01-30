var React        = require('react');
var ActiveMediaStore = require('../stores/ActiveMediaStore');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');


function getStateFromStores() {
    return  {
        volume: ActiveMediaStore.getVolume(),
    }
}

var VolumeBar = React.createClass({
    
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
        ActiveMediaActionCreator.setVolume(volume);
    },

    render: function() {
        var volUp    = 'img/volume-high.png';
        var volDown  = 'img/volume-low.png'
        var volume   = this.state.volume;

        return (
            <div className="volume">
                <img 
                    className="img-media shrink-35" 
                    src={volDown}
                    onClick={this._onMute}/>

                <div className="volume">
                    <input 
                        type="range"  
                        min="0" 
                        max="100" 
                        value={volume * 100}
                        onChange={this._onVolumeChange}/>
                </div>
                
                <img 
                    className="img-media shrink-35" 
                    src={volUp}
                    onClick={this._onMax}/>

            </div>
        );
    }

});

module.exports = VolumeBar;

