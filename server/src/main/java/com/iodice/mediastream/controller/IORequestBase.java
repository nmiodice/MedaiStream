package com.iodice.mediastream.controller;

import com.iodice.mediastream.App;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import java.io.File;
import java.io.IOException;
import java.net.URLConnection;
import java.nio.file.Files;

/**
 * Provides basic utilities common to multiple IO-based requests
 */
public abstract class IORequestBase {

    @Autowired
    protected Environment environment;

    protected File makeRelativeToMediaBase(String fp) {
        fp = new File(environment.getProperty(App.MEDIA_FP) + fp).getAbsolutePath();
        if (!fp.startsWith(environment.getProperty(App.MEDIA_FP)))
            return new File(environment.getProperty(App.MEDIA_FP));
        else
            return new File(fp);
    }

    /**
     * Try to get a mime type of the file, using progressively slower and more
     * accurate methods (speed is of importance here)
     * @param f A file for which the mime type will be guessed
     * @return The mime type, or null if it cannot be determined
     */
    protected String getMimeType(File f) {
        String mimeType = URLConnection.guessContentTypeFromName(f.getName());

        if (mimeType == null) {
            try {
                mimeType = Files.probeContentType(f.toPath());
            } catch (IOException ignored){}
        }

        if (mimeType == null) {
            try {
                mimeType = new Tika().detect(f);
            } catch (IOException ignored){}
        }
        return mimeType;
    }

}
