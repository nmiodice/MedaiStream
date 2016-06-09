var $                        = require('jquery');
var React                    = require('react');
var ActiveMediaPreviewStore  = require('../../stores/ActiveMediaPreviewStore');
var MediaPreviewAC           = require('../../actions/MediaPreviewAC');
var Mousetrap                = require('Mousetrap');
var FileTypes                = require('../../constants/FileConstants').types;
var Image                    = require('./Image.react');
var Video                    = require('./Video.react');
var PlainText                = require('./PlainText.react');

function getStateFromStores() {
    return  {
        activeFile     : ActiveMediaPreviewStore.getActiveFile()
    }
}

var PreviewViewport = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveMediaPreviewStore.addChangeListener(this._onChange);
        Mousetrap.bind('esc', this._onCloseClick);
    },

    componentWillUnmount: function() {
        ActiveMediaPreviewStore.removeChangeListener(this._onChange);
        Mousetrap.unbind('esc');
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onCloseClick : function() {
        MediaPreviewAC.clearFile();
    },

    render: function() {

        if (this.state.activeFile == null) {
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

        var innerComponent = null;
        switch (this.state.activeFile.type) {
            case FileTypes.IMAGE:
                innerComponent = <Image file={this.state.activeFile}/>;
                break;

            case FileTypes.VIDEO:
                innerComponent = <Video file={this.state.activeFile}/>;
                break;

            case FileTypes.TEXT:
                innerComponent = <PlainText file={this.state.activeFile}/>;
                break;

            default:
                alert('Cannot preview this file!');
        }

        if (innerComponent == null)
            return null;

        return (
            <div className="preview-viewport">
                <span
                    className="glyphicon glyphicon-remove exit-button"
                    onClick={this._onCloseClick}/>
                {innerComponent}
            </div>
        );
    }

});

module.exports = PreviewViewport;

