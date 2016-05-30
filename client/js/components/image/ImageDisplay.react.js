var $                        = require('jquery');
var React                    = require('react');
var ActiveImageStore         = require('../../stores/ActiveImageStore');
var ActiveImageActionCreator = require('../../actions/ActiveImageActionCreator');
var UriUtils                 = require('../../utils/UriUtils');

function getStateFromStores() {
    return  {
        activeImage     : ActiveImageStore.getActiveImage(),
    }
}

var AudioController = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ActiveImageStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActiveImageStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onCloseClick : function() {
        ActiveImageActionCreator.clearImage(this.state.activeImage);
    },

    render: function() {

        if (this.state.activeImage == null) {
            // allow scrolling on desktop
            $(document.body).removeClass('stop-scrolling');
            // allow scrolling on mobile
            $(document.body).unbind('touchmove');
            return null;
        }

        // prevent scrolling on desktop
        $(document.body).addClass('stop-scrolling');
        // prevent scrolling on mobile
        $(document.body).bind('touchmove', function(e) {e.preventDefault()});

        var uri = UriUtils.fileToURI(this.state.activeImage);
        return (
            <div className="image-viewport">
                <img className="image" src = {uri}/>
                <span
                    className="glyphicon glyphicon-remove exit-button"
                    onClick={this._onCloseClick}/>
            </div>
        );
    }

});

module.exports = AudioController;

