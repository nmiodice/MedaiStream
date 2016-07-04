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
                console.log('video ended');
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

    /**
     * Create video container manually because the VideoJS library manipulates the DOM
     * in a way that is not compatible with React.
     */
    _onComponentRendered : function(divDOM) {
        if (divDOM == null)
            return;

        var videoContainer = document.createElement('video');
        videoContainer.id = 'video-container';
        videoContainer.className = 'preview video-js vjs-default-skin vjs-big-play-centered';

        var sourceContainer = document.createElement('source');
        sourceContainer.src = UriUtils.fileToURI(this.props.file);
        sourceContainer.type = this.props.file.mimeType;

        videoContainer.appendChild(sourceContainer);
        divDOM.appendChild(videoContainer);
    },

    render: function() {
        return (
            <div className="preview-image" ref={(divDOM) => this._onComponentRendered(divDOM)}>
            </div>
        );
    }

});

module.exports = Video;
