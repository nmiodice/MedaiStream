//
//  AppDelegate.swift
//  MediaServer
//
//  Created by Nick Iodice on 7/11/16.
//  Copyright (c) 2016 Nick Iodice. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(aNotification: NSNotification) {
        FileUtils.makeShareFolder();
        println("application finished launching")
    }

    func applicationWillTerminate(aNotification: NSNotification) {
        // Insert code here to tear down your application
    }


}

