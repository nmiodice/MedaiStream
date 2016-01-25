var fs     = require("fs");
var path   = require('path');
var client = require('../constants/ClientConstants')
var fileTypes = require('../constants/FileConstants').types;

var fileutils = {

    getExtension : function(fp) {
        return path.extname(fp)
    },

    getRecursiveFileListing : function(dir) {
        var results = [];

        fs.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(fileutils.getRecursiveFileListing(file))
            } else results.push(file);

        });

        return results;
    },

    getType : function(fp, callback) {
        return fs.stat(fp, function(err, stats) {
            if (err) {
                callback(fileTypes.UNKNOWN);
                return;
            }
            
            if (stats.isDirectory()) {
                callback(fileTypes.DIRECTORY)
                return
            }

            if (stats.isFile()) {
                callback(fileTypes.FILE);
                return;
            }

            callback(fileTypes.UNKNOWN);
        });
    },

    getMimeType : function(fp) {
        var extname = fileutils.getExtension(fp);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            
            case '.css':
                contentType = 'text/css';
                break;
            
            case '.json':
                contentType = 'application/json';
                break;
            
            case '.png':
                contentType = 'image/png';
                break;      
            
            case '.jpg':
                contentType = 'image/jpg';
                break;
            
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        return contentType;
    },

    read : function(fp, callback) {
        fs.readFile(fp, callback);
    },

    relativeToClientDirectory : function (path) {
        return client.APP_LOCATION + path;
    }
}

module.exports = fileutils
