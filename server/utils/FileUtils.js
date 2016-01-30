var fs     = require("fs");
var path   = require('path');
var fileLocations = require('../constants/FileLocationConstants')
var fileTypes = require('../../common/constants/FileConstants').types;

var fileutils = {

    getExtension : function(fp) {
        return path.extname(fp)
    },

    getFileListing : function(dir) {
        var results = [];
        if (dir.slice(-1) != '/')
            dir += '/';

        fs.readdirSync(dir).forEach(function(file) {
            // don't return hidden folders or files
            if (file.startsWith(".")) {
                return;
            }

            file = {
                path : dir + file,
                type : fileTypes.UNKNOWN
            };

            var stat = fs.statSync(file.path);

            if (stat.isFile()) {
                file.type = fileTypes.FILE;
            } else if (stat.isDirectory()) {
                file.type = fileTypes.DIRECTORY;
            }

            results.push(file);
        });

        results.forEach(function(r) {
            r.path = r.path.replace(fileLocations.APP_LOCATION, '');
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

            case '.mp3':
                contentType = 'audio/mp3';
                break;
        }

        return contentType;
    },

    read : function(fp, callback) {
        fs.readFile(fp, callback);
    },
}

module.exports = fileutils
