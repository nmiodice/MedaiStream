var React                     = require('react');
var UriUtils                  = require('../../utils/UriUtils');
var Mousetrap                 = require('Mousetrap');
var FileAndDirectoryStore     = require('../../stores/FileAndDirectoryStore');
var DirectoryAC               = require('../../actions/DirectoryAC');
var FileAC                    = require('../../actions/FileAC');
var ActiveMediaPreviewStore   = require('../../stores/ActiveMediaPreviewStore');

function getStateFromStores() {
    return  {
        file     : FileAndDirectoryStore.getFileData(),
        stackPos : FileAndDirectoryStore.getFileStackSize(),
        filter   : FileAndDirectoryStore.getFilter()
    }
}

var NavigationController = React.createClass({
    
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        FileAndDirectoryStore.addChangeListener(this._onChange);
        Mousetrap.bind('backspace', function(event) {
            event.preventDefault();
            this._onGoBackClick();
        }.bind(this), 'keydown');
    },

    componentWillUnmount: function() {
        FileAndDirectoryStore.removeChangeListener(this._onChange);
        Mousetrap.unbind('backspace');
    },

    _onChange : function() {
        this.setState(getStateFromStores());
    },

    _onGoBackClick : function() {
        if (ActiveMediaPreviewStore.getActiveImage() == null)
            DirectoryAC.moveUpDirectory();
    },

    _onFilterChange : function(event) {
        var text = event.target.value.toLowerCase();
        FileAC.filter(text);
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var name     = UriUtils.stripHTTP(path);
        var stackPos = this.state.stackPos;
        var disabledButton = stackPos == 1;
        
        if (name == '' || name == '/') {
            name = "";
        }

        return (
            <div className="container default-margin-vertical">
                <span>
                    <div className="form-group">
                        <a
                            role="button"
                            className="btn btn-default btn-sm"
                            disabled={disabledButton}
                            onClick={this._onGoBackClick}>
                            &#8592;
                        </a>
                        <input
                            className="float-right form-control"
                            type="text"
                            placeholder="Filter..."
                            value={this.state.filter}
                            onChange={this._onFilterChange}/>
                    </div>
                </span>
                <span className="light-text">{name}</span>
            </div>
        );
    }

});

module.exports = NavigationController;

