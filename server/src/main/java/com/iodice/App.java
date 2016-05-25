package com.iodice;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.*;

import java.io.File;

@ComponentScan(basePackages = {"com.iodice"})
@Controller
@EnableAutoConfiguration
@Configuration
public class App {

    public static String MEDIA_FP = "mediadir";

    private static void usage() {
        System.out.println(String.format(
                "arguments:\n\t %s=%s",
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

    public static void main(String[] args) throws Exception {
        if (args.length != 1)
            usage();

        if (!checkMediaDirArg(args[0]))
            usage();

        SpringApplication.run(App.class, args);
    }
}