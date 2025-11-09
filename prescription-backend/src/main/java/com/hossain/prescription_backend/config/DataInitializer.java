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
        
        // Clear existing admin user
        userRepository.findByUsername("admin").ifPresent(user -> {
            System.out.println("Deleting existing admin user...");
            userRepository.delete(user);
            userRepository.flush(); // Force immediate deletion
        });
        
        // Create admin user
        System.out.println("Creating admin user...");
        User admin = new User();
        admin.setUsername("admin");
        String rawPassword = "password";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        admin.setPassword(encodedPassword);
        admin.setRole("ADMIN");
        
        User savedAdmin = userRepository.save(admin);
        
        System.out.println("✅ Admin user created successfully!");
        System.out.println("   Username: " + savedAdmin.getUsername());
        System.out.println("   Role: " + savedAdmin.getRole());
        System.out.println("   Password (raw): " + rawPassword);
        System.out.println("   Password (encoded): " + encodedPassword);
        System.out.println("   Encoded length: " + encodedPassword.length());
        
        // Verify the password encoder works
        boolean testMatch = passwordEncoder.matches(rawPassword, encodedPassword);
        System.out.println("   Password verification test: " + (testMatch ? "✅ PASS" : "❌ FAIL"));

        // Create doctor user
        userRepository.findByUsername("doctor").ifPresent(user -> {
            System.out.println("Deleting existing doctor user...");
            userRepository.delete(user);
            userRepository.flush();
        });
        
        System.out.println("Creating doctor user...");
        User doctor = new User();
        doctor.setUsername("doctor");
        doctor.setPassword(passwordEncoder.encode("password"));
        doctor.setRole("USER");
        userRepository.save(doctor);
        System.out.println("✅ Doctor user created - username: doctor, password: password");

        System.out.println("=== DATA INITIALIZER COMPLETED ===");
    }
}