package com.example.backend_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Vietnote Spring Boot Application
 * Migrated from Laravel to Spring Boot 3.x (Java 21)
 *
 * @EnableAsync — Enables asynchronous method execution.
 * Allows @Async annotation on service methods (e.g. sendOtpEmail)
 * to run in a separate thread pool, replacing Laravel's Queue/delay mechanism.
 */
@SpringBootApplication
@EnableAsync
public class BackendSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendSpringApplication.class, args);
	}

}
