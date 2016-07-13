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
    
    let javaUtil: JavaUtils = JavaUtils()
    
    
    var fileList: [[String]] = [[String]]();
    
    var serverRunning: Bool = false;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.setDelegate(self)
        tableView.setDataSource(self)
        reloadTable()
        reloadServerButton()
    }

    override var representedObject: AnyObject? {
        didSet {
        // Update the view, if already loaded.
        }
    }
    
    func reloadServerButton() {
        serverButton!.title = serverRunning ? "Stop Server" : "Start Server"
    }
    
    @IBAction func onServerButtonClick(sender: NSButtonCell) {
        if serverRunning {
            if javaUtil.stopServer() {
                serverRunning = false
            } else {
                serverRunning = true
            }
        } else {
            if javaUtil.startServer(FileUtils.getShareFolderPath()) {
                serverRunning = true
            } else {
                serverRunning = false
            }
        }
        reloadServerButton();
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

