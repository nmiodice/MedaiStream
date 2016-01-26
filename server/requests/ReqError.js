var fileUtils  = require('../utils/FileUtils');
var fileErrors = require('../../common/constants/FileConstants').errors;
var fileLocations = require('../constants/FileLocationConstants');

var handler = {
	handle : function(request, response, error) {
		if(error.code == fileErrors.NOT_FOUND) {
            var html = fileLocations.ASSETS_LOCATION + "/404.html";
            
            fileUtils.read(html, function(error, content) {
                response.writeHead(404, { 
                    'Content-Type': "text/html"
                });
                response.end(content, 'utf-8');
            });
        } else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        }
	}
}

module.exports = handler;
