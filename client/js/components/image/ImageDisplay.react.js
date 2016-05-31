var $                        = require('jquery');
var React                    = require('react');
var ActiveImageStore         = require('../../stores/ActiveImageStore');
var ActiveImageActionCreator = require('../../actions/ActiveImageActionCreator');
var UriUtils                 = require('../../utils/UriUtils');
var Mousetrap                = require('Mousetrap');
var loadImage                = require('blueimp-load-image');
var UIUtils                  = require('../../utils/UIUtils');

function getStateFromStores() {
    return  {
        activeImage     : ActiveImageStore.getActiveImage()
    }
}

var ImageDisplay = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveImageStore.addChangeListener(this._onChange);
        Mousetrap.bind('esc', this._onCloseClick);
    },

    componentWillUnmount: function() {
        ActiveImageStore.removeChangeListener(this._onChange);
        Mousetrap.unbind('esc');
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onCloseClick : function() {
        ActiveImageActionCreator.clearImage(this.state.activeImage);
    },

    _onRenderedComponent : function(divDOM) {
        if (this.state.activeImage) {
            UIUtils.addLoader();
            this._handleImageExifLoad(divDOM);
        }
    },

    /**
     * Load an image and rotate it based on its parsed EXIF metadata,
     * if possible
     */
    _handleImageExifLoad : function(divDOM) {
        var uri = UriUtils.fileToURI(this.state.activeImage);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', uri, true);
        xhr.responseType = 'arraybuffer';

        var onloadImage = function(imgDOM) {
            UIUtils.removeLoader();
            imgDOM.className = "image";
            divDOM.appendChild(imgDOM);
        };

        xhr.onload = function(e) {
            var ori = 0;
            if (this.status == 200) {
                //var blob = this.response;
                var arrayBufferView = new Uint8Array(this.response);
                var blob = new Blob([arrayBufferView], { type: "image/jpeg" });

                var onLoadEXIF = function(data) {
                    if (data.exif)
                        ori = data.exif.get('Orientation');
                    loadImage(blob, onloadImage, {orientation: ori});
                };

                loadImage.parseMetaData(blob, onLoadEXIF);
            } else {
                console.log("error loading image: " + this.status);
                alert('Cannot load image file!');
            }
        };
        xhr.send();
   },

    render: function() {

        if (this.state.activeImage == null) {
            // allow scrolling on desktop
            $(document.body).removeClass('stop-scrolling');
            // allow scrolling on mobile
            $(document.body).unbind('touchmove');
            return null;
        }

        // prevent scrolling on desktop
        $(document.body).addClass('stop-scrolling');
        // prevent scrolling on mobile
        $(document.body).bind('touchmove', function(e) {e.preventDefault()});

        return (
            <div className="image-viewport" ref={(divDOM) => this._onRenderedComponent(divDOM)}>
                <span
                    className="glyphicon glyphicon-remove exit-button"
                    onClick={this._onCloseClick}/>
            </div>
        );
    }

});

module.exports = ImageDisplay;

