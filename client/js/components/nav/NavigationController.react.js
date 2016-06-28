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
        if (ActiveMediaPreviewStore.getActiveFile() == null)
            DirectoryAC.moveUpDirectory();
    },

    _onFilterChange : function(event) {
        var text = event.target.value.toLowerCase();
        FileAC.filter(text);
    },

    _makePathButtons : function(path) {
        path = path.trim();
        var pathParts = path.split('/');

        var buttons = [];
        var seenPathParts = [];

        pathParts.forEach(function(x) {
            if (buttons.length > 0) {
                buttons.push(<div className="nav-location-control" key={location + '-sep'}>&gt;</div>);
            }

            seenPathParts.push(x);

            var isLast = seenPathParts.length == pathParts.length;
            var location = seenPathParts.join('/');
            var className = isLast ? "nav-location-control" : "nav-location-control-clickable";
            var displayName = x == "" ? "Home" : x;

            var onclick = isLast ? null : function() {
                DirectoryAC.setDirectory(location);
            };

            buttons.push(<div className={className} key={location} onClick={onclick}>{displayName}</div>);

        });

        return buttons;
    },

    render: function() {
        var fileData = this.state.file;
        var path     = fileData.path;
        var displayPath = UriUtils.stripHTTP(path);
        var disabledButton = path == '/' || path == '';

        if (displayPath == '' || displayPath == '/') {
            displayPath = " ";
        }

        var buttons = this._makePathButtons(displayPath);

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
                <span className="nav-location-control-container">{buttons}</span>
            </div>
        );
    }

});

module.exports = NavigationController;

