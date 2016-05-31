var Spinner = require('spin');
var $       = require('JQuery');

var UIUtils = {
    _loaderIsActive : function() {
        return $("#spinner-container").children().length != 0;
    },

    addLoader : function() {
        var opts = {
            lines: 7
            , length: 47
            , width: 5
            , radius: 27 // The radius of the inner circle
            , scale: 1.25 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#FFFFFF'
            , opacity: 0.45
            , speed: 1.1
            , trail: 46
            , fps: 20
            , className: 'spinner'
        };

        if (!this._loaderIsActive()){
            var loaderDOM = document.createElement("DIV");
            loaderDOM.className = 'loader';
            new Spinner(opts).spin(loaderDOM);

            //$(loaderDOM).hide().appendTo("#spinner-container").fadeIn("fast");

            $("#spinner-container").append(loaderDOM);
        }
    },

    removeLoader : function() {
        if (this._loaderIsActive()) {
            $("#spinner-container").empty();
        }
    }
};

module.exports = UIUtils;
