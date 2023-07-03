package com.devmountain.nlpApp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// The Config class is a configuration class in the Spring Framework.
// It is responsible for defining and configuring beans that will be managed by the Spring container

// @Configuration: This annotation is used to indicate that the class is a configuration class.
// It is scanned by the Spring container during application startup.
@Configuration
public class Config {
    // This method is annotated with @Bean and is responsible for creating and configuring a bean of type PasswordEncoder.
    // It returns a BCryptPasswordEncoder object, which is a password encoder implementation provided by Spring Security.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
