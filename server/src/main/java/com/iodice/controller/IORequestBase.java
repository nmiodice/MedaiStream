package com.iodice.controller;

import com.iodice.App;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import java.io.File;

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

}
