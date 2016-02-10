var React              = require('react');
var RemoteFileStore    = require('../../stores/RemoteFileStore');
var FileListContainer  = require('./FileListContainer.react');

function getStateFromStores() {
    return  {
        stack : RemoteFileStore.getFileStack(),
        topFile : RemoteFileStore.getFileData()
    }
}

var NavigationPane = React.createClass({

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

    render: function() {

        var stk = this.state.stack;
        var top = this.state.topFile;

        switch (stk.length) {
            case 0:
                return (
                    <div className="container body-bottom-adjust">
                        <div>
                            <FileListContainer file={top} isTop={true} pos={"left"}/>
                        </div>
                    </div>);

            case 1:
                return (
                    <div className="container body-bottom-adjust">
                        <div>
                            <FileListContainer file={stk[stk.length - 1]} pos={"left"}/>
                        </div>
                        <div>
                            <FileListContainer file={top} isTop={true} pos={"mid"}/>
                        </div>
                    </div>);

            default:
                return (
                    <div className="container body-bottom-adjust">
                        <div>
                            <FileListContainer file={stk[stk.length - 2]} pos={"left"}/>
                        </div>
                        <div>
                            <FileListContainer file={stk[stk.length - 1]} pos={"mid"}/>
                        </div>
                        <div>
                            <FileListContainer file={top} isTop={true} pos={"right"}/>
                        </div>
                    </div>);

        }
    }

});

module.exports = NavigationPane;
