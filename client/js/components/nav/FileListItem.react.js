var $                        = require('jquery');
var FileUtils                = require('../../utils/FileUtils');
var React                    = require('react');
var FileTypes                = require('../../../../common/constants/FileConstants').types;
var ActiveMediaStore         = require('../../stores/ActiveMediaStore');
var FileListActionCreator    = require('../../actions/FileListActionCreator')
var FileListStore            = require('../../stores/FileListStore')

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
        if (this._isSelected()) {
            this._scrollToOnScreen();
        }
    },

    _scrollToOnScreen : function() {
        var me = $(this.getDOMNode());
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

    _isActive : function() {
        var activeFile = ActiveMediaStore.getActiveMedia();
        var file = this.props.file;
        return activeFile != null && file.path == activeFile.path;
    },

    _isSelected : function() {
        var selectedFile = FileListStore.getSelectedFile();
        var file = this.props.file;
        return isSelect = selectedFile != null && file.path == selectedFile.path;
    },

    render: function() {
        var file = this.props.file;
        var text = FileUtils.fileToDisplayString(file);
        var iconClass;
        var className = "list-group-item noselect";

        if (this._isActive()) {
            className += " active-media-item";
        } else if (this._isSelected()) {
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

