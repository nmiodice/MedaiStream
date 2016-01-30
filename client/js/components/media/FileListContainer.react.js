
var React        = require('react');
var FileListItem = require('./FileListItem.react');
var UriUtils     = require('../utils/UriUtils')

var RemoteFileStore = require('../stores/RemoteFileStore');
var RemoteFileActionCreator = require('../actions/RemoteFileActionCreator');

function getStateFromStores() {
    return  {
        file     : RemoteFileStore.getFileData(),
    }
}

var FileListContainer = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        RemoteFileActionCreator.loadFilesFromServer();
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);

        return (
            <div className="container body-bottom-adjust">
        
                <ul className="list-group">
                    {fileData.files.map(function(f) {
                        return <FileListItem file={f} key={f.path}/>;
                    })}
                </ul>

            </div>
        );
    }

});

module.exports = FileListContainer;

