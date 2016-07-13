//
//  JavaUtils.swift
//  MediaServer
//
//  Created by Nick Iodice on 7/12/16.
//  Copyright (c) 2016 Nick Iodice. All rights reserved.
//

import Foundation

class JavaUtils {
    
    static let NO_PID: Int32 = -1
    static let JAR_NAME: String = "mediaserver-1.0-SNAPSHOT.jar"
    var javaPID: Int32 = JavaUtils.NO_PID
    
    init () {
        var output : [String] = []
        
        let task = NSTask()
        task.launchPath = "/bin/ps"
        task.arguments = ["-ef"]
        
        let outpipe = NSPipe()
        task.standardOutput = outpipe
        task.launch()
        
        let outdata = outpipe.fileHandleForReading.readDataToEndOfFile()
        if var string = String.fromCString(UnsafePointer(outdata.bytes)) {
            string = string.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet())
            output = string.componentsSeparatedByString("\n")
            
            for line in output {
                if line.rangeOfString(JavaUtils.JAR_NAME) != nil {
                    var parts : [String] = line.componentsSeparatedByCharactersInSet(.whitespaceAndNewlineCharacterSet())
                    
                    var count = 0
                    for p in parts {
                        var val = p.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceAndNewlineCharacterSet()).toInt()

                        if val != nil {
                            count++
                        }
                        
                        if count == 2 {
                            self.javaPID = Int32(val!);
                            println("found existing server, PID = \(self.javaPID)");
                            return
                        }
                    }
                }
            }
        }
        
        println("did not find server running");
    }
    
    
    func startServer(sharedDirectory: String) -> Bool {
        if isRunning() {
            return true
        }
        
        let jarPath = "/Users/nmiodice/Dropbox/dev/projects/mediaserver/server/target/" + JavaUtils.JAR_NAME
        
        let task = NSTask()
        task.launchPath = "/usr/bin/java"
        task.arguments = ["-jar", jarPath, "--mediadir=" + sharedDirectory]
        task.launch()
        
        self.javaPID = task.processIdentifier
        print("pid is \(self.javaPID)")
        return true;
    }
    
    func stopServer() -> Bool {
        if !isRunning() {
            return true
        }
        
        let task = NSTask()
        task.launchPath = "/bin/kill"
        task.arguments = [String(self.javaPID)]
        task.launch()
        task.waitUntilExit()
        
        
        self.javaPID = JavaUtils.NO_PID;
        return true;
    }
    
    func isRunning() -> Bool {
        return self.javaPID != JavaUtils.NO_PID
    }
    
    deinit {
        println("deinit")
        if isRunning() {
            stopServer()
        }
    }
}