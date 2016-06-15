package com.iodice.mediastream;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.*;

import java.io.File;
import java.io.IOException;

@ComponentScan(basePackages = {"com.iodice.mediastream"})
@Controller
@EnableAutoConfiguration
@Configuration
public class App {

    public static final String MEDIA_FP = "mediadir";

    private static void usage() {
        System.out.println(String.format(
                "arguments:\n\t --%s=%s",
                MEDIA_FP,
                "<media directory>"
        ));
        System.exit(-1);
    }

    private static boolean checkMediaDirArg(String arg) {
        String[] parts = arg.split("=");
        return parts.length == 2 &&
                parts[0].endsWith(MEDIA_FP) &&
                new File(parts[1]).isDirectory();

    }

    private static String fixRelativeArg(String arg) throws IOException {
        String[] parts = arg.split("=");
        parts[1] = new File(parts[1]).getCanonicalPath();
        return parts[0] + "=" + parts[1] + "/";
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 1)
            usage();

        if (!checkMediaDirArg(args[0]))
            usage();

        args[0] = fixRelativeArg(args[0]);
        SpringApplication.run(App.class, args);
    }
}