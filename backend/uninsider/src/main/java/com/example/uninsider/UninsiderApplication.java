package com.example.uninsider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })

public class UninsiderApplication {

	public static void main(String[] args) {
		SpringApplication.run(UninsiderApplication.class, args);
	}

}
