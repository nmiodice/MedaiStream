var React           = require('react');
var UriUtils        = require('../utils/UriUtils')
var FileAndDirectoryStore = require('../stores/FileAndDirectoryStore');

function getStateFromStores() {
    return  {
        file : FileAndDirectoryStore.getFileData(),
    }
}

var NavigationBar = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        FileAndDirectoryStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        FileAndDirectoryStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);

        return (
            <nav className="navbar navbar-default navbar-fixed-top navbar-inner">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Media • Server</a>
                    </div>
                </div>
            </nav>
        );
    }

});

module.exports = NavigationBar;

