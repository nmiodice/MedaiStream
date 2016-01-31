var React        = require('react');
var FileListItem = require('./FileListItem.react');
var UriUtils     = require('../utils/UriUtils')
var FileUtils     = require('../utils/FileUtils')
var FileTypes    = require('../../../common/constants/FileConstants').types;

var RemoteFileStore = require('../stores/RemoteFileStore');
var RemoteFileActionCreator = require('../actions/RemoteFileActionCreator');

function getStateFromStores() {
    return  {
        file : RemoteFileStore.getFileData(),
    }
}

var FileListContainer = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        RemoteFileActionCreator.fetchFiles();
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onSelectAll : function() {
        // var file = this.state.file;
        // var wildFile = FileUtils.fileToWildcardFile(file);;
        // var uri = UriUtils.fileToURI(wildFile);

        // RemoteFileActionCreator.setFile(wildFile);
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);

        var hasDirectory = false;
        for (i = 0; i < fileData.files.length; i++) {
            if (fileData.files[i].type == FileTypes.DIRECTORY)
                hasDirectory = true;
            if (hasDirectory)
                break;
        }

        return (
            <div className="container body-bottom-adjust">

                <ul className="list-group">
                    <div 
                        className="list-group-item noselect"
                        onClick={this._onSelectAll}>
                        <span className={''}/>
                        <a className="default-margin">{'Show all'}</a>
                    </div>

                    {fileData.files.map(function(f) {
                        return <FileListItem file={f} key={f.path} isParent={false}/>;
                    })}
                </ul>

            </div>
        );
    }

});

module.exports = FileListContainer;

