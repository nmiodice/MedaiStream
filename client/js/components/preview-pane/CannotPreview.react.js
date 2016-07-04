var React            = require('react');
var FileUtils        = require('../../utils/FileUtils');

var CannotPreview = React.createClass({

    render: function() {
        var className = FileUtils.fileToIconClass(this.props.file);
        className += " text-center preview no-preview-available";

        return (
            <span className={className}/>
        );
    }

});

module.exports = CannotPreview;

