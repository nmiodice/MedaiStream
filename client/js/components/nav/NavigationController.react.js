var React                   = require('react');
var UriUtils                = require('../../utils/UriUtils')
var Mousetrap               = require('Mousetrap')
var RemoteFileStore         = require('../../stores/RemoteFileStore');
var RemoteDirectoryActionCreator = require('../../actions/RemoteDirectoryActionCreator');

function getStateFromStores() {
    return  {
        file     : RemoteFileStore.getFileData(),
        stackPos : RemoteFileStore.getFileStackSize()
    }
}

var NavigationController = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        Mousetrap.bind('backspace', function(event) {
            event.preventDefault();
            this._onGoBackClick();
        }.bind(this), 'keydown');
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
        Mousetrap.unbind('backspace');
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onGoBackClick : function() {
        RemoteDirectoryActionCreator.moveUpDirectory();
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);
        var stackPos = this.state.stackPos;
        var disabledButton = stackPos == 0;
        
        if (name == '' || name == '/') {
            name = "";
        }

        return (
            <div className="container default-margin-vertical">
                <span>
                    <a
                        role="button" 
                        className="btn btn-default btn-sm"
                        disabled={disabledButton}
                        onClick={this._onGoBackClick}>
                        &#8592;
                    </a>
                </span>
                <span className="default-margin light-text">{name}</span>
            </div>
        );
    }

});

module.exports = NavigationController;

