var React            = require('react');
var UriUtils         = require('../../utils/UriUtils');
var UIUtils          = require('../../utils/UIUtils');

var PDF = React.createClass({

    render: function() {
        var uri = UriUtils.fileToURI(this.props.file);
        return (
            <iframe className="preview preview-pdf" src={uri} type='application/pdf'></iframe>
        );
    }

});

module.exports = PDF;

