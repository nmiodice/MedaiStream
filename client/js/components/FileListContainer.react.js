var React        = require('react');
var FileListItem = require('./FileListItem.react');
var UriUtils     = require('../utils/UriUtils')
var FileUtils     = require('../utils/FileUtils')
var FileTypes    = require('../../../common/constants/FileConstants').types;
var Mousetrap    = require('Mousetrap');
var RemoteFileStore = require('../stores/RemoteFileStore');
var RemoteFileActionCreator = require('../actions/RemoteFileActionCreator');
var FileListStore            = require('../stores/FileListStore')
var FileListActionCreator = require('../actions/FileListActionCreator');

function getStateFromStores() {
    return  {
        file : RemoteFileStore.getFileData(),
    }
}

var searchKeys = []

for (i = ' '.charCodeAt(0); i < '}'.charCodeAt(0) + 1; i++)
    searchKeys.push(String.fromCharCode(i));

var FileListContainer = React.createClass({
    searchTerm : '',

    lastSearchTime : -1,

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        RemoteFileActionCreator.fetchFiles();

        Mousetrap.bind('down', this._onNextFile);
        Mousetrap.bind('up', this._onPrevFile);
        Mousetrap.bind('enter', this._onLoadFile);
        Mousetrap.bind(searchKeys, this._onFilter);
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);

        Mousetrap.unbind('down');
        Mousetrap.unbind('up');
        Mousetrap.unbind('enter');
        Mousetrap.unbind(searchKeys);
    },

    _onNextFile : function() {
        FileListActionCreator.nextRow(this.state.file);
    },

    _onPrevFile : function() {
        FileListActionCreator.prevRow();
    },

    _onLoadFile : function() {
        var selectedFile = FileListStore.getSelectedFile();
        if (selectedFile == null)
            return;
        FileUtils.handleFile(selectedFile);
    },

    _onFilter : function(event) {
        event.preventDefault();
        var now = new Date().getTime();
        var diff = now - this.lastSearchTime;

        this.lastSearchTime = now;
        if (diff > 1000) {
            this.searchTerm = '';
        }

        this.searchTerm += String.fromCharCode(event.keyCode).toLowerCase();
        console.log(this.searchTerm);

        var files = this.state.file.files;
        for (i = 0; i < files.length; i++) {
            var f = files[i];
            var fdisp = FileUtils.fileToDisplayString(f);

            fdisp = fdisp.toLowerCase();

            if (fdisp.startsWith(this.searchTerm)) {
                FileListActionCreator.setSelectedRow(f);
                return;
            }
        }

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

