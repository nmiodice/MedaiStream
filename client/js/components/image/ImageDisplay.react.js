var $                        = require('jquery');
var React                    = require('react');
var ActiveImageStore         = require('../../stores/ActiveImageStore');
var ActiveImageActionCreator = require('../../actions/ActiveImageActionCreator');
var UriUtils                 = require('../../utils/UriUtils');
var Mousetrap                = require('Mousetrap');
var loadImage                = require('blueimp-load-image');
//var loadImageExif            = require('blueimp-load-image/js/load-image-exif');

function getStateFromStores() {
    return  {
        activeImage     : ActiveImageStore.getActiveImage()
    }
}

var AudioController = React.createClass({

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
            var uri = UriUtils.fileToURI(this.state.activeImage);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', uri, true);
            xhr.responseType = 'arraybuffer';

            var onloadImage = function(imgDOM) {
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
                        console.log('exif');
                        console.log(data);
                        console.log(blob);
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




            //
            //$.get(
            //    uri,
            //    function(imgData, status) {
            //        if (imgData) {
            //            loadImage.parseMetaData(imgData, function(exifData) {
            //                var ori;
            //                console.log(exifData);
            //                if (exifData.exif) {
            //                    ori = exifData.exif.get('Orientation');
            //                    alert(ori);
            //                }
            //                loadImage(uri,
            //                    function (imgDOM) {
            //                        imgDOM.className = "image";
            //                        divDOM.appendChild(imgDOM);
            //                    }, {
            //                        orientation : ori
            //                    })
            //            });
            //        } else {
            //            console.log("Error loading image from server: " + status);
            //            alert("Cannot load image from server!");
            //        }
            //    }
            //);




            //loadImage(uri,
            //    function (imgDOM) {
            //        imgDOM.className = "image";
            //        divDOM.appendChild(imgDOM);
            //    }, {
            //        orientation : true
            //    })
        }
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

module.exports = AudioController;

