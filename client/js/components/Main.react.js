
var React             = require('react');
var FileListContainer = require('./FileListContainer.react')
var AppBar            = require('./AppBar.react')
var NavigationController = require('./NavigationController.react');
var MediaPlayer = require('./MediaPlayer.react');

var Main = React.createClass({

	render: function() {
		return (
			<div>
				<AppBar/>
				<NavigationController/>
				<FileListContainer/>
				<MediaPlayer/>
			</div>
		);
	}

});

module.exports = Main;

