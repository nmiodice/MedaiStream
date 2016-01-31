
var React        = require('react');
var UriUtils     = require('../utils/UriUtils')

var RemoteFileStore = require('../stores/RemoteFileStore');
var RemoteFileActionCreator = require('../actions/RemoteFileActionCreator');

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
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onGoBackClick : function() {
        RemoteFileActionCreator.moveUpDirectory();
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
            <div className="container default-margin-verticle">
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

