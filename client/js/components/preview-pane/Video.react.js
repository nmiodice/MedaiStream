var React            = require('react');
var UriUtils         = require('../../utils/UriUtils');
var VideoJS          = require('video.js');

var _player = null;

var Video = React.createClass({

    componentDidMount : function() {
        _player = VideoJS('video-container', this._getVideoOptions(), function() {

            var that = this;
            this.on('canplay', function() {
                that.play();
            });

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
            techOrder : isChrome ? ["flash", "html5"] : ["html5", "flash"]
        };

        options.width = "640";
        options.height = "264";
        options.preload = "auto";
        options.controls = true;
        options.autoplay = true;

        return options;
    },

    render: function() {
        var uri = UriUtils.fileToURI(this.props.file);

        return (
            <video id="video-container" className="preview video-js vjs-default-skin vjs-big-play-centered">
                <source src={uri} type={this.props.file.mimeType}/>
            </video>
        );
    }

});

module.exports = Video;
