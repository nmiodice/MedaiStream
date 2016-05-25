var fs            = require("fs");
var path          = require('path');
var fileLocations = require('../constants/FileLocationConstants')
var fileTypes     = require('../../common/constants/FileConstants').types;

var fileutils = {

    getExtension : function(fp) {
        return path.extname(fp)
    },

    _getFileListing : function(topDir, recursive, callback) {
        if (topDir.slice(-1) != '/')
            topDir += '/';
        
        var results = [];
        var depth = 0;

        /**
         * find files in a file system directory and accumulate files in 
         * subdirectories only if the recursive flag is set to true. Uses
         * callbacks and a depth counter to only respond when the full
         * search is done
         */
        var walk = function(dir, recursive, callback) {
            fs.readdir(dir, function(err, files) {
                if (!err) {
                    console.log(dir);
                    console.log(files);
                    files.forEach(function(file) {
                        // don't return hidden folders or files
                        if (file.startsWith(".")) return;

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

                        if (stat.isDirectory() && recursive) {
                            depth++;
                        } else {
                            results.push(file);
                        }
                    });

                    results.forEach(function(r) {
                        r.path = r.path.replace(fileLocations.APP_LOCATION, '');
                    });
                }

                if (depth == 0)
                    callback(err, results);

                depth--;
            });
        };

        walk(topDir, recursive, callback);
    },

    getFileListing : function(dir, callback) {
        this._getFileListing(dir, false, callback);
    },

    getRecursiveFileListing : function(dir, callback) {
        this._getFileListing(dir, true, callback);
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
        var stats = fs.statSync(fp)
        var size = stats["size"]

        fs.readFile(fp, function(error, content) {
            callback(error, content, size);
        });
    },
}

module.exports = fileutils
