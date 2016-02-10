var React                = require('react');
var NavigationPane       = require('./nav/NavigationPane.react')
var AppBar               = require('./AppBar.react')
var NavigationController = require('./nav/NavigationController.react');
var MediaController      = require('./media/MediaController.react');

var Main = React.createClass({

	render: function() {
		return (
			<div className='main'>
				<AppBar id='AppBar'/>
				<NavigationController/>
				<NavigationPane/>
				<MediaController/>
			</div>
		);
	}

});

module.exports = Main;

