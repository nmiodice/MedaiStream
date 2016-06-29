var React                    = require('react');
var UIUtils                  = require('../../utils/UIUtils');
var UriUtils                 = require('../../utils/UriUtils');
var loadImage                = require('blueimp-load-image');

var Image = React.createClass({

    _onComponentRendered : function(divDOM) {
        if (this.props.file && divDOM) {
            UIUtils.addLoader();
            this._handleImageExifLoad(divDOM);
        }
    },

    /**
     * Load an image and rotate it based on its parsed EXIF metadata,
     * if possible
     */
    _handleImageExifLoad : function(divDOM) {
        if (this.props.file == null || divDOM == null)
            return;

        var uri = UriUtils.fileToURI(this.props.file);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', uri, true);
        xhr.responseType = 'arraybuffer';

        var onloadImage = function(imgDOM) {
            UIUtils.removeLoader();
            imgDOM.className = "preview preview-image";
            divDOM.appendChild(imgDOM);
        };

        xhr.onload = function() {
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
        return (
            <div className="preview-image" ref={(divDOM) => this._onComponentRendered(divDOM)}>
            </div>
        );
    }

});

module.exports = Image;

