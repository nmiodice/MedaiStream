package com.iodice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;


@Controller
public class IOFileRequests extends IORequestBase {
    private static final String FILE_REQUEST_PREFIX = "/file/";
    private static final String FILE_REQUEST_PATH = FILE_REQUEST_PREFIX + "**";


    @RequestMapping(value=FILE_REQUEST_PATH, method=RequestMethod.GET)
    void file(HttpServletRequest request, HttpServletResponse response) {
        String url = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String pathPart = url.replaceFirst(FILE_REQUEST_PREFIX, "");
        File requestedFile = makeRelativeToMediaBase(pathPart);

        if (requestedFile.exists()) {
            try {
                InputStream is = new FileInputStream(requestedFile);
                org.apache.commons.io.IOUtils.copy(is, response.getOutputStream());
                response.flushBuffer();

                is.close();
            } catch (IOException ex) {
                throw new RuntimeException("IOError writing file to output stream");
            }
        }
    }

}
