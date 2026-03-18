package com.healthwellness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HealthWellnessApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthWellnessApplication.class, args);
    }
}
