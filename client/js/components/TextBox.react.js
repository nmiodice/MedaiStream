
var React = require('react');
var TextBox = React.createClass({

  	render: function() {
  		var text = this.props.text;

    	return (
      		<div className="text-box">
      			{text}
      		</div>
    	);
  	}

});

module.exports = TextBox;
