
var React             = require('react');
var FileListContainer = require('./FileListContainer.react')
var AppBar            = require('./AppBar.react')
var NavigationController = require('./NavigationController.react');
var MediaController = require('./MediaController.react');

var Main = React.createClass({

	render: function() {
		return (
			<div>
				<AppBar/>
				<NavigationController/>
				<FileListContainer/>
				<MediaController/>
			</div>
		);
	}

});

module.exports = Main;

