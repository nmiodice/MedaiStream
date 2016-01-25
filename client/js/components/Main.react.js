
var React             = require('react');
var FileListContainer = require('./FileListContainer.react')
var ServerConstants   = require('../constants/serverConstants');

var Main = React.createClass({

	render: function() {
		return (
			<div className="main">
				<FileListContainer/>
			</div>
		);
	}

});

module.exports = Main;

