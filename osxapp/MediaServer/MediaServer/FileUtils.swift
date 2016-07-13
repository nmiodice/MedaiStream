//
//  FileUtils.swift
//  MediaServer
//
//  Created by Nick Iodice on 7/11/16.
//  Copyright (c) 2016 Nick Iodice. All rights reserved.
//

import Foundation

class FileUtils {
    static let shareFolderName = ".mediaserver/";
    
    static func getShareFolderPath() -> String {
        let homedir = NSHomeDirectory();
        return homedir + "/" + shareFolderName;
    }
    
    static func makeShareFolder() -> Bool {
        var error: NSError?
        let manager = NSFileManager.defaultManager()
        let sharePath = getShareFolderPath();
        
        if manager.fileExistsAtPath(sharePath) {
            return true
        }

        let success = manager.createDirectoryAtPath(
            sharePath,
            withIntermediateDirectories: false,
            attributes: nil,
            error: &error)
        
        if success {
            println("successfully created \(sharePath)")
        } else {
            println("did not create \(sharePath): \(error!.localizedDescription)")
        }
        
        return success;
    }
    
    static func link(source: NSURL) -> Bool {
        var error: NSError?
        let manager = NSFileManager.defaultManager()
        let sharePath = getShareFolderPath()
        let fullPath = sharePath + source.lastPathComponent!
        
        if manager.fileExistsAtPath(fullPath) {
            return true
        }

        let success = manager.createSymbolicLinkAtPath(
            fullPath,
            withDestinationPath: source.path!,
            error: &error)

        if success {
            println("successfully made symlink at \(source.path!)")
        } else {
            println("could not make symlink at \(source.path!): \(error!.localizedDescription)")
        }
        return success;
    }
    
    static func unlink(source: String) -> Bool {
        var error: NSError?
        let manager = NSFileManager.defaultManager()
        let sharePath = getShareFolderPath()

        let success = manager.removeItemAtPath(source, error: &error)
        
        if success {
            println("successfully removed \(source)")
        } else {
            println("could not remove \(source): \(error!.localizedDescription)")
        }
        return success;
    }
    
    static func shareFolderLS() -> [[String]] {
        let manager = NSFileManager.defaultManager()
        let sharePath = getShareFolderPath()
        var error: NSError?
        var fileList: [[String]] = [[String]]();
        var filePaths: [AnyObject] = manager.contentsOfDirectoryAtPath(sharePath, error: &error)!

        for filePath in filePaths {
            var fileURL = NSURL(fileURLWithPath: sharePath + (filePath as! String));
            var toAppend: [String] = [];
            var fileResolved = fileURL?.URLByResolvingSymlinksInPath;
            var fileResolvedPath = fileResolved?.path;
            
            toAppend.append((fileResolved?.path)!)
            toAppend.append((fileURL?.path)!)
            
            fileList += [toAppend];
        }
        
        return fileList;
    }
}