var React            = require('react');
var UriUtils         = require('../../utils/UriUtils');
var UIUtils          = require('../../utils/UIUtils');
var $                = require('Jquery');

var PlainText = React.createClass({

    componentDidMount : function() {
        if (this.props.file) {
            var uri = UriUtils.fileToURI(this.props.file);
            UIUtils.addLoader();

            $('#text-container').load(
                uri,
                null,
                function() {
                    UIUtils.removeLoader();
                }.bind(this)
            );
        }
    },

    componentWillUnmount : function() {
    },

    render: function() {

        return (
            <div id="text-container" className="preview plain-text">
            </div>
        );
    }

});

module.exports = PlainText;

