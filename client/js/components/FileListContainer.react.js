
var React        = require('react');
var TextBox      = require('./TextBox.react');
var FileListItem = require('./FileListItem.react');
var FileUtils    = require('../utils/FileUtils')
var UriUtils     = require('../utils/UriUtils')

var RemoteFileStore = require('../stores/RemoteFileStore');
var MediaDataActionCreator = require('../actions/MediaDataActionCreator');

function getStateFromStores() {
    return  {
        file     : RemoteFileStore.getFileData(),
        stackPos : RemoteFileStore.getFileStackSize()
    }
}

var FileListContainer = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        MediaDataActionCreator.loadFilesFromServer();
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onGoBackClick : function() {
        MediaDataActionCreator.goBackOneURI();
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);
        var stackPos = this.state.stackPos;

        return (
            <div className="file-list-container">

                <TextBox text={name} className="list-heading"/>
                
                {stackPos > 0 ? <button onClick={this._onGoBackClick}>Back</button> : null}
        
                <ul className="file-list">
                    {fileData.files.map(function(f) {
                        return <FileListItem file={f} key={f.path}/>;
                    })}
                </ul>

            </div>
        );
    }

});

module.exports = FileListContainer;

