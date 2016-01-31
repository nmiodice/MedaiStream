var RemoteFileActionCreator  = require('../actions/RemoteFileActionCreator');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');
var FileUtils                = require('../utils/FileUtils');
var React                    = require('react');
var FileTypes                = require('../../../common/constants/FileConstants').types;
var UriUtils                 = require('../utils/UriUtils');
var ActiveMediaStore         = require('../stores/ActiveMediaStore');

var FileListItem = React.createClass({

    componentDidMount: function() {
        ActiveMediaStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActiveMediaStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
    	// when file becomes active, file object doesn't change,
    	// but the rendering for this component might
        this.forceUpdate();
    },

	_onClick : function() {
		var file = this.props.file;
		
		switch (file.type) {
			case FileTypes.DIRECTORY:
				RemoteFileActionCreator.setFile(file);
				break;

			case FileTypes.FILE:
				ActiveMediaActionCreator.setActivePlaylist(file);
				break;

			default:
				break;
		}
	},

  	render: function() {
  		var file = this.props.file;
  		var text = FileUtils.fileToDisplayString(file);
    	var iconClass;
    	var activeFile = ActiveMediaStore.getActiveMedia();

    	var className = "list-group-item noselect";
    	if (activeFile != null && file.path == activeFile.path) {
    		className += " active-media-item"
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
      		<li className={className} onClick={this._onClick}>
      			<span className={iconClass}/>
      			<a className="default-margin">{text}</a>
      		</li>
    	);
  	}

});

module.exports = FileListItem;

