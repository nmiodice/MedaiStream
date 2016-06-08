var React            = require('react');
var UriUtils         = require('../../utils/UriUtils');
var VideoJS          = require('video.js');

var _player = null;

var Video = React.createClass({

    componentDidMount : function() {
        _player = VideoJS('video-container', this._getVideoOptions(), function() {

            this.play();

            // How about an event listener?
            this.on('ended', function() {
                console.log('awww...over so soon?');
            });
        });

    },

    componentWillUnmount : function() {
        if (_player != null) {
            _player.dispose();
            _player = null;
        }
    },

    _getVideoOptions : function() {
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var options = {
            techOrder : ["html5"]
        };

        // I.E? Safari? Works for FireFox and Chrome
        if (isChrome) {
            options.techOrder.unshift("flash")
        }

        options.width = "640";
        options.height = "264";
        options.preload = "auto";
        options.controls = true;
        options.controlBar = {
            muteToggle: true
        };

        return options;
    },

    render: function() {
        var uri = UriUtils.fileToURI(this.props.file);

        return (
            <video id="video-container" className="preview video-js vjs-default-skin">
                <source src={uri} type="video/mp4"/>
            </video>
        );
    }

});

module.exports = Video;

