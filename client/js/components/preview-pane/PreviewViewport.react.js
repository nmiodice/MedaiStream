var $                        = require('jquery');
var React                    = require('react');
var ActiveMediaPreviewStore  = require('../../stores/ActiveMediaPreviewStore');
var MediaPreviewAC           = require('../../actions/MediaPreviewAC');
var Mousetrap                = require('Mousetrap');
var FileTypes                = require('../../constants/FileConstants').types;
var Image                    = require('./Image.react');
var Video                    = require('./Video.react');
var PlainText                = require('./PlainText.react');
var PDF                      = require('./PDF.react');
var CannotPreview            = require('./CannotPreview.react');
var FileUtils                = require('../../utils/FileUtils');

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

    _getInnerComponent : function() {
        var innerComponent = null;
        var f = this.state.activeFile;
        var fp = f.path;

        switch (this.state.activeFile.type) {
            case FileTypes.IMAGE:
                innerComponent = <Image key={fp} file={f}/>;
                break;

            case FileTypes.VIDEO:
                innerComponent = <Video key={fp} file={f}/>;
                break;

            case FileTypes.TEXT:
                innerComponent = <PlainText key={fp} file={f}/>;
                break;

            case FileTypes.PDF:
                innerComponent = <PDF key={fp} file={f}/>;
                break;

            default:
                innerComponent = <CannotPreview key={fp} file={f}/>;
        }
        return innerComponent;

    },

    _configure : function() {
        if (this.state.activeFile == null) {
            // allow scrolling on desktop
            $(document.body).removeClass('stop-scrolling');
            // allow scrolling on mobile
            $(document.body).unbind('touchmove');
        } else {
            // prevent scrolling on desktop
            $(document.body).addClass('stop-scrolling');
            // prevent scrolling on mobile
            $(document.body).bind('touchmove', function(e) {e.preventDefault()});
        }
    },

    render: function() {
        this._configure();
        if (this.state.activeFile == null)
            return null;

        var innerComponent = this._getInnerComponent();
        if (innerComponent == null)
            return null;

        var positionData = ActiveMediaPreviewStore.getActiveFilePositionData();
        var pos = positionData.position + 1;
        var tot = positionData.total;
        var positionString = pos + "/" + tot;

        return (
            <div className="preview-viewport">
                <div className="preview-viewport-navigation">
                    <span className="glyphicon glyphicon-arrow-left btn-lg" onClick={MediaPreviewAC.previousFile}/>
                    {positionString}
                    <span className="glyphicon glyphicon-arrow-right btn-lg" onClick={MediaPreviewAC.nextFile}/>
                </div>
                <span
                    className="glyphicon glyphicon-remove exit-button"
                    onClick={this._onCloseClick}/>
                {innerComponent}

                <p className="preview-viewport-filename">{FileUtils.fileToDisplayString(this.state.activeFile)}</p>
            </div>
        );
    }

});

module.exports = PreviewViewport;

