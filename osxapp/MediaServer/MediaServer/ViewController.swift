//
//  ViewController.swift
//  MediaServer
//
//  Created by Nick Iodice on 7/11/16.
//  Copyright (c) 2016 Nick Iodice. All rights reserved.
//

import Cocoa

class ViewController: NSViewController {
    

    @IBOutlet weak var serverButton: NSButton!
    
    @IBOutlet weak var tableView: NSTableView!
    
    @IBOutlet weak var serverStatus: NSTextField!
    
    let javaUtil: JavaUtils = JavaUtils()
    
    var fileList: [[String]] = [[String]]();
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.setDelegate(self)
        tableView.setDataSource(self)
        reloadTable()
        reloadServerInfo()
    }

    override var representedObject: AnyObject? {
        didSet {
        // Update the view, if already loaded.
        }
    }
    
    func reloadServerInfo() {
        if javaUtil.isRunning() {
            serverButton!.title = "Stop Server"
            serverStatus!.textColor = NSColor.greenColor()
            serverStatus!.stringValue = "running"
        } else {
            serverButton!.title = "Run Server"
            serverStatus!.textColor = NSColor.redColor()
            serverStatus!.stringValue = "stopped"
        }
    }
    
    @IBAction func onServerButtonClick(sender: NSButtonCell) {
        if javaUtil.isRunning() {
            javaUtil.stopServer()
        } else {
            javaUtil.startServer(FileUtils.getShareFolderPath())
        }
        reloadServerInfo();
    }
    
    func reloadTable() {
        fileList = FileUtils.shareFolderLS();
        tableView.reloadData();
    }

    @IBAction func onAddDeleteClick(segment: NSSegmentedControl) {
        if segment.selectedSegment == 0 {
            doAdd()
        } else {
            doDelete()
        }
    }
    
    func doAdd() {
        
        // Create the File Open Dialog class.
        var openDlg: NSOpenPanel = NSOpenPanel()
        openDlg.canChooseFiles = false;
        openDlg.canChooseDirectories = true;
        openDlg.allowsMultipleSelection = true;
        
        if openDlg.runModal() == NSFileHandlingPanelOKButton {
            for dirURL in openDlg.URLs {
                FileUtils.link(dirURL as! NSURL);
            }
        }
        
        reloadTable()
    }
    
    func doDelete() {
        if tableView.selectedRow >= 0 {
            
            for idx in tableView.selectedRowIndexes {
                FileUtils.unlink(fileList[idx][1])
            }
            
            reloadTable()
        } else {
            println("delete requested, but no row selected");
        }
    }


}

extension ViewController : NSTableViewDataSource {
    func numberOfRowsInTableView(tableView: NSTableView) -> Int {
        return fileList.count ?? 0
    }
}

extension ViewController : NSTableViewDelegate {
    func tableView(tableView: NSTableView, viewForTableColumn tableColumn: NSTableColumn?, row: Int) -> NSView? {
        
        
        if let cell = tableView.makeViewWithIdentifier("SharedFolders", owner: nil) as? NSTableCellView {
            cell.textField?.stringValue = fileList[row][0]
            cell.imageView?.image =  nil
            return cell
        }
        return nil;

    }
}

