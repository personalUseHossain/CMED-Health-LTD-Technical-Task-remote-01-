package com.hossain.prescription_backend.config;

import com.hossain.prescription_backend.model.Prescription;
import com.hossain.prescription_backend.model.User;
import com.hossain.prescription_backend.repository.PrescriptionRepository;
import com.hossain.prescription_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DATA INITIALIZER STARTED ===");
        
        // Create admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            System.out.println("Creating admin user...");
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Admin user created - username: admin, password: password");
        } else {
            System.out.println("❌ Admin user already exists");
        }

        // Create doctor user if not exists
        if (userRepository.findByUsername("doctor").isEmpty()) {
            System.out.println("Creating doctor user...");
            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setPassword(passwordEncoder.encode("password"));
            doctor.setRole("USER");
            userRepository.save(doctor);
            System.out.println("✅ Doctor user created - username: doctor, password: password");
        } else {
            System.out.println("❌ Doctor user already exists");
        }

        System.out.println("=== DATA INITIALIZER COMPLETED ===");
    }
}