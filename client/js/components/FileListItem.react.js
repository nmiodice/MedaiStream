var MediaDataActionCreator = require('../actions/MediaDataActionCreator');
var FileUtils              = require('../utils/FileUtils');
var React                  = require('react');
var FileTypes              = require('../../../common/constants/FileConstants').types;
var UriUtils               = require('../utils/UriUtils');

var FileListItem = React.createClass({

	_onClick : function() {
		var file = this.props.file;
		
		switch (file.type) {
			case FileTypes.DIRECTORY:
				var URI = UriUtils.fileToURI(file);
				MediaDataActionCreator.changeMediaURI(URI);
				break;

			case FileTypes.FILE:
				alert("Cannot handle file clicks yet!");
				break;

			default:
				break;
		}
	},

  	render: function() {
  		var file = this.props.file;
  		var text = FileUtils.fileToDisplayString(file);
    
    	return (
      		<li onClick={this._onClick}>{text}</li>
    	);
  	}

});

module.exports = FileListItem;

