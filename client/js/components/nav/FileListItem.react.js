var $                   = require('jquery');
var FileUtils           = require('../../utils/FileUtils');
var FileHandler         = require('../../utils/FileHandler');
var React               = require('react');
var FileTypes           = require('../../constants/FileConstants').types;
var ActiveAudioStore    = require('../../stores/ActiveAudioStore');
var SelectedFileAC      = require('../../actions/SelectedFileAC');
var SelectedFileStore   = require('../../stores/SelectedFileStore');

var FileListItem = React.createClass({

    componentDidMount: function() {
        ActiveAudioStore.addChangeListener(this._onChange);
        SelectedFileStore.addChangeListener(this._onChange);
        this.wasSelected = false;
    },

    componentWillUnmount: function() {
        ActiveAudioStore.removeChangeListener(this._onChange);
        SelectedFileStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        // when file becomes active, file object doesn't change,
        // but the rendering for this component might
        //this.forceUpdate();
        if (this._isSelectedFile()) {
            this.wasSelected = true;
            this.forceUpdate();
            this._scrollToOnScreen();
        } else {
            if (this.wasSelected)
                this.forceUpdate();
            this.wasSelected = false;
        }
    },

    _scrollToOnScreen : function() {
        var me = $(this.me);
        var body = $('body');
        var bOff = 60;

        var bTop = body.scrollTop();
        var bBtm = bTop + $(window).height();
        var mTop = me.offset().top - bOff;
        var mBtm = mTop + me.height();

        // row is above the viewport
        if (mTop < bTop) {
            body.scrollTop(mTop - 25);

        // row is below the viewport
        } else if (mBtm + 200 > bBtm) {
            body.scrollTop(mTop - $(window).height() + 200);
        }
    },

    _onSelect : function() {
        SelectedFileAC.setSelectedRow(this.props.file);
    },

    _onLoad : function(event) {
        var file = this.props.file;
        SelectedFileAC.setSelectedRow(this.props.file);
        FileHandler.handleFile(file);
        event.stopPropagation();
    },

    _isActiveFile : function() {
        var activeFile = ActiveAudioStore.getActiveAudio();
        var file = this.props.file;
        return activeFile != null && file.path == activeFile.path;
    },

    _isSelectedFile : function() {
        var selectedFile = SelectedFileStore.getSelectedFile();
        var file = this.props.file;
        return selectedFile != null && file.path == selectedFile.path;
    },

    render: function() {
        var file = this.props.file;
        var text = FileUtils.fileToDisplayString(file);
        var iconClass;
        var className = "list-group-item noselect";

        if (this._isActiveFile()) {
            className += " active-media-item";
        } else if (this._isSelectedFile()) {
            className += " selected-media-item";
        } 

        switch (file.type) {
            case FileTypes.DIRECTORY:
                if (this._isSelectedFile())
                    iconClass = "glyphicon glyphicon-folder-open";
                else
                    iconClass = "glyphicon glyphicon-folder-close";
                break;

            case FileTypes.AUDIO:
                iconClass = "glyphicon glyphicon-play-circle";
                break;

            case FileTypes.IMAGE:
                iconClass = "glyphicon glyphicon-picture";
                break;

            case FileTypes.VIDEO:
                iconClass = "glyphicon glyphicon-facetime-video";
                break;

            case FileTypes.COMPRESSED:
                iconClass = "glyphicon glyphicon-compressed";
                break;

            case FileTypes.TEXT:
                iconClass = "glyphicon glyphicon-pencil";
                break;

            default:
                iconClass = "glyphicon glyphicon-file";
                break;      
        }

        return (
            <li
                className={className}
                onClick={this._onSelect}
                onDoubleClick={this._onLoad}
                ref={(ref) => this.me = ref}>
                <span className={iconClass}/>
                <a className="default-margin"
                    onClick={this._onLoad}>{text}</a>
            </li>
        );
    }

});

module.exports = FileListItem;

