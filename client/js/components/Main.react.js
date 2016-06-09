var React                = require('react');
var FileListContainer    = require('./nav/FileListContainer.react');
var AppBar               = require('./AppBar.react');
var NavigationController = require('./nav/NavigationController.react');
var AudioController      = require('./audio/AudioController.react');
var PreviewViewport      = require('./preview-pane/PreviewViewport.react');

var Main = React.createClass({

	render: function() {
		return (
			<div className='main'>
				<AppBar id='AppBar'/>
				<NavigationController/>
				<FileListContainer/>
				<AudioController/>
				<PreviewViewport/>

				<div id="spinner-container"></div>
			</div>
		);
	}

});

module.exports = Main;

