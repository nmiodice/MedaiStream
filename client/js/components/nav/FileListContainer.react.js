var React                   = require('react');
var FileListItem            = require('./FileListItem.react');
var FileUtils               = require('../../utils/FileUtils');
var FileHandler             = require('../../utils/FileHandler');
var FileTypes               = require('../../../../common/constants/FileConstants').types;
var Mousetrap               = require('Mousetrap');
var RemoteFileStore         = require('../../stores/RemoteFileStore');
var RemoteDirectoryActionCreator = require('../../actions/RemoteDirectoryActionCreator');
var FileActionCreator = require('../../actions/FileActionCreator');
var FileListStore           = require('../../stores/FileListStore')
var FileListActionCreator   = require('../../actions/FileListActionCreator');

function getStateFromStores() {
    return  {
        file : RemoteFileStore.getFileData(),
    }
}

var searchKeys = [];

// search any printable characters, identified by this range
// note: unicode not supported due to lazy developer :)
for (var i = ' '.charCodeAt(0); i < '}'.charCodeAt(0) + 1; i++)
    searchKeys.push(String.fromCharCode(i));

var FileListContainer = React.createClass({
    searchTerm : '',

    lastSearchTime : -1,

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        RemoteFileStore.addChangeListener(this._onChange);
        FileActionCreator.fetchFiles();
        this.bindKeys();
    },

    componentWillUnmount: function() {
        RemoteFileStore.removeChangeListener(this._onChange);
        this.unBindKeys();
    },

    bindKeys : function() {
        Mousetrap.bind('down', this._onNextFile);
        Mousetrap.bind('up', this._onPrevFile);
        Mousetrap.bind('enter', this._onLoadFile);
        Mousetrap.bind(searchKeys, this._onFilter);
    },

    unBindKeys : function() {
        Mousetrap.unbind('down');
        Mousetrap.unbind('up');
        Mousetrap.unbind('enter');
        Mousetrap.unbind(searchKeys);
    },

    _onNextFile : function(event) {
        if (event) {
            event.preventDefault();
        }
        FileListActionCreator.nextRow(this.state.file);
    },

    _onPrevFile : function(event) {
        if (event) {
            event.preventDefault();
        }
        FileListActionCreator.prevRow();
    },

    _onLoadFile : function() {
        var selectedFile = FileListStore.getSelectedFile();
        if (selectedFile == null)
            return;
        FileHandler.handleFile(selectedFile);
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
        RemoteDirectoryActionCreator.setDirectoryRecursive(this.state.file);
    },

    render: function() {
        var fileData = this.state.file;

        this.searchTerm = '';
        var noDirectory = true;

        for (var i = 0; i < fileData.files.length; i++) {
            if (fileData.files[i].type == FileTypes.DIRECTORY) {
                noDirectory = false;
                break;
            }
        }

        return (
            <div className={"container body-bottom-adjust"}>

                <ul className="list-group file-list">
                    {noDirectory ? null:
                        <div
                            className="list-group-item noselect"
                            onClick={this._onSelectAll}>
                            <span className={''}/>
                            <a className="default-margin">{'Show all'}</a>
                        </div>}


                    {fileData.files.map(function(f) {
                        return <FileListItem file={f} key={f.path} isParent={false}/>;
                    })}
                </ul>

            </div>
        );
    }

});

module.exports = FileListContainer;
