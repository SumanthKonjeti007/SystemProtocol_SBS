package com.securebanking.sbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class SbsApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SbsApplication.class, args);
	}

}
