package com.iodice.mediastream.controller;

import com.iodice.mediastream.App;
import com.iodice.mediastream.entity.FileEntity;
import com.iodice.mediastream.types.FileType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;

@Controller
public class IODirectoryRequests extends IORequestBase {

    private static final String DIRECTORY_REQUEST_PATH = "/directory/";

    private static final String FILES_RESP_KEY = "files";
    private static final String DIRECTORY_QPARAM = "directory";
    private static final String RECURSIVE_QPARAM = "recursive";


    /**
     * Remove file-system specific path components from a file path, making
     * it safe for a client to consume
     */
    private FileEntity toRelativeFileEntity(File f) {
        FileEntity fileEntity = new FileEntity();
        String fullPath = f.getPath();
        String mediaBase = new File(environment.getProperty(App.MEDIA_FP)).toString();

        assert(fullPath.startsWith(mediaBase));

        fileEntity.path = fullPath.replaceFirst(mediaBase, "");

        if (f.isDirectory())
            fileEntity.type = FileType.DIRECTORY;
        else {
            fileEntity.type = FileType.UNKNOWN;
            String mimeType = getMimeType(f);

            if (mimeType != null) {
                if (mimeType.contains("text")) {
                    fileEntity.type = FileType.FILE_TEXT;
                } else if (mimeType.contains("audio")) {
                    fileEntity.type = FileType.FILE_AUDIO;
                } else if (mimeType.contains("image")) {
                    fileEntity.type = FileType.FILE_IMAGE;
                } else if (mimeType.contains("video")) {
                    fileEntity.type = FileType.FILE_VIDEO;
                } else if (mimeType.contains("zip")) {
                    fileEntity.type = FileType.FILE_COMPRESSED;
                }
            }
        }

        return fileEntity;
    }

    private void gatherFilesDFS(File parent, ArrayList<FileEntity> found) {
        File[] files = parent.listFiles();
        if (files == null)
            return;

        for (File f : files) {
            if (f.isDirectory())
                gatherFilesDFS(f, found);
            else if (f.isFile()) {
                addIfValid(f, found);
            }
        }
    }

    private void addIfValid(File f, ArrayList<FileEntity> gathered) {
        if (f.isHidden() || f.getName().startsWith("."))
            return;
        gathered.add(toRelativeFileEntity(f));
    }

    /**
     * File listing for a directory
     * @param directory directory to get file listing for
     * @param recursive true if a search of all sub directories should
     *                  be done, false otherwise
     * @return JSON response is in the form of
     *  {
     *      files : [
     *          {f_path : "...", f_type : ...}, ...
     *      ]
     *  }
     */
    @RequestMapping(value=DIRECTORY_REQUEST_PATH, method=RequestMethod.GET)
    @ResponseBody
    Map<String, List<FileEntity>> directory(
            @RequestParam(value=DIRECTORY_QPARAM, required=true) String directory,
            @RequestParam(value=RECURSIVE_QPARAM, required=true) Boolean recursive) {

        HashMap<String, List<FileEntity>> response = new HashMap<>();
        ArrayList<FileEntity> parsedFiles = new ArrayList<>();
        response.put(FILES_RESP_KEY, parsedFiles);
        File root = makeRelativeToMediaBase(directory);

        if (recursive) {
            gatherFilesDFS(root, parsedFiles);
        } else {
            File[] foundFiles = root.listFiles();
            if (foundFiles != null) {
                for (File f : foundFiles)
                    addIfValid(f, parsedFiles);
            }
        }

        return response;
    }

}
