
var React        = require('react');
var TextBox      = require('./TextBox.react');
var FileListItem = require('./FileListItem.react');

var RemoteFileStore = require('../stores/RemoteFileStore');
var MediaDataActionCreator = require('../actions/MediaDataActionCreator');

function getStateFromStores() {
    return RemoteFileStore.getFileData()
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
        var uri = this.state.uri;

        return (
            <div className="file-list-container">

                <TextBox text={uri} className = "uri-listing"/>
                <button onClick={this._onGoBackClick}/>
                <ul className="file-list" ref="file-list">
                    {this.state.files.map(function(f) {
                        return <FileListItem file={f} key={f.path}/>;
                    })}
                </ul>

            </div>
        );
    }

});

module.exports = FileListContainer;

