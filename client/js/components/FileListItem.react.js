var RemoteFileActionCreator  = require('../actions/RemoteFileActionCreator');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');
var FileUtils                = require('../utils/FileUtils');
var React                    = require('react');
var FileTypes                = require('../../../common/constants/FileConstants').types;
var UriUtils                 = require('../utils/UriUtils');
var ActiveMediaStore         = require('../stores/ActiveMediaStore');
var FileListActionCreator    = require('../actions/FileListActionCreator')
var FileListStore            = require('../stores/FileListStore')

var FileListItem = React.createClass({

    componentDidMount: function() {
        ActiveMediaStore.addChangeListener(this._onChange);
        FileListStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActiveMediaStore.removeChangeListener(this._onChange);
        FileListStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        // when file becomes active, file object doesn't change,
        // but the rendering for this component might
        this.forceUpdate();
    },

    _onSelect : function(event) {
        FileListActionCreator.setSelectedRow(this.props.file);
    },

    _onLoad : function(event) {
        var file = this.props.file;
        FileListActionCreator.setSelectedRow(this.props.file);
        FileUtils.handleFile(file);
        event.stopPropagation();
        event.cancelBubble = true;
    },

    render: function() {
        var file = this.props.file;
        var text = FileUtils.fileToDisplayString(file);
        var iconClass;
        var activeFile = ActiveMediaStore.getActiveMedia();
        var selectedFile = FileListStore.getSelectedFile();

        var className = "list-group-item noselect";
        var isActive = activeFile != null && file.path == activeFile.path;
        var isSelect = selectedFile != null && file.path == selectedFile.path;

        if (isActive) {
            className += " active-media-item";
        } else if (isSelect) {
            className += " selected-media-item";
        } 

        switch (file.type) {
            case FileTypes.DIRECTORY:
                iconClass = "glyphicon glyphicon-folder-close"
                break;

            case FileTypes.FILE:
                iconClass = "glyphicon glyphicon-play-circle"
                break;

            default:
                iconClass = "glyphicon glyphicon-question-sign"
                break;      
        }

        return (
            <li className={className} onClick={this._onSelect} onDoubleClick={this._onLoad}>
                <span className={iconClass}/>
                <a className="default-margin" 
                    onClick={this._onLoad}>{text}</a>
                </li>
        );
    }

});

module.exports = FileListItem;

