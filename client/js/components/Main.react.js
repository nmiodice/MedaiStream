var React                = require('react');
var FileListContainer    = require('./nav/FileListContainer.react')
var AppBar               = require('./AppBar.react')
var NavigationController = require('./nav/NavigationController.react');
var MediaController      = require('./media/MediaController.react');

var Main = React.createClass({

	render: function() {
		return (
			<div className='main'>
				<AppBar id='AppBar'/>
				<NavigationController/>
				<FileListContainer/>
				<MediaController/>
			</div>
		);
	}

});

module.exports = Main;

