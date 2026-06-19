package com.employeemgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Employee Management System application.
 *
 * The @SpringBootApplication annotation is a convenience annotation that combines:
 *   - @Configuration:    Marks this class as a source of bean definitions.
 *   - @EnableAutoConfiguration: Tells Spring Boot to auto-configure beans based on
 *                               the dependencies present on the classpath.
 *   - @ComponentScan:    Tells Spring to scan this package (and sub-packages) for
 *                        components, configurations, and services.
 */
@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        // SpringApplication.run() bootstraps the application, starting the
        // embedded server and loading the Spring context.
        SpringApplication.run(EmployeeManagementApplication.class, args);
    }
}
