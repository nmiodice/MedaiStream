var RemoteFileActionCreator  = require('../actions/RemoteFileActionCreator');
var ActiveMediaActionCreator = require('../actions/ActiveMediaActionCreator');
var FileUtils                = require('../utils/FileUtils');
var React                    = require('react');
var FileTypes                = require('../../../common/constants/FileConstants').types;
var UriUtils                 = require('../utils/UriUtils');

var FileListItem = React.createClass({

	_onClick : function() {
		var file = this.props.file;
		
		switch (file.type) {
			case FileTypes.DIRECTORY:
				var URI = UriUtils.fileToURI(file);
				RemoteFileActionCreator.changeMediaURI(file, URI);
				break;

			case FileTypes.FILE:
				// var URI = UriUtils.fileToURI(file);
				// window.location = URI;
				ActiveMediaActionCreator.setActiveMedia(file);
				break;

			default:
				break;
		}
	},

  	render: function() {
  		var file = this.props.file;
  		var text = FileUtils.fileToDisplayString(file);
    	var iconClass;

    	switch (file.type) {
			case FileTypes.DIRECTORY:
				iconClass = "glyphicon glyphicon-folder-open"
				break;

			case FileTypes.FILE:
				iconClass = "glyphicon glyphicon-play-circle"
				break;

			default:
				iconClass = "glyphicon glyphicon-question-sign"
				break;    	
			}

    	return (
      		<li className="list-group-item" onClick={this._onClick}>
      			<span className={iconClass}/>
      			<a className="default-margin">{text}</a>
      		</li>
    	);
  	}

});

module.exports = FileListItem;

