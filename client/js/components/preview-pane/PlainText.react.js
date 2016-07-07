var React            = require('react');
var UriUtils         = require('../../utils/UriUtils');
var UIUtils          = require('../../utils/UIUtils');
var $                = require('Jquery');

var PlainText = React.createClass({

    componentDidMount : function() {
        if (this.props.file) {
            var uri = UriUtils.fileToURI(this.props.file);
            UIUtils.addLoader();

            //$('#text-container').load(
            //    uri,
            //    null,
            //    function(txt) {
            //        alert(txt);
            //        UIUtils.removeLoader();
            //    }.bind(this)
            //);

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    UIUtils.removeLoader();
                    var text = xhttp.responseText;
                    text = text.replace(/&/g, '&amp;');
                    text = text.replace(/</g, '&lt;');
                    text = text.replace(/>/g, '&gt;');

                    $('#text-container')[0].innerHTML = text;
                }
            };
            xhttp.open("GET", uri, true);
            xhttp.send();
        }
    },


    render: function() {

        return (
            <div id="text-container" className="preview preview-plain-text">
            </div>
        );
    }

});

module.exports = PlainText;

