package com.hospital.management.config;

import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );
                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);
            }
        };
    }
}