package com.hossain.prescription_backend.controller;

import com.hossain.prescription_backend.dto.LoginRequest;
import com.hossain.prescription_backend.dto.LoginResponse;
import com.hossain.prescription_backend.model.User;
import com.hossain.prescription_backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        System.out.println("Login attempt for user: " + loginRequest.getUsername());
        
        return userRepository.findByUsername(loginRequest.getUsername())
            .map(user -> {
                System.out.println("User found: " + user.getUsername());
                System.out.println("Input password: " + loginRequest.getPassword());
                System.out.println("Stored encoded password: " + user.getPassword());
                
                boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                System.out.println("Password matches: " + passwordMatches);
                
                if (!passwordMatches) {
                    session.setAttribute("username", user.getUsername());
                    session.setAttribute("role", user.getRole());
                    
                    LoginResponse response = new LoginResponse(
                        user.getUsername(), 
                        "Login successful", 
                        user.getRole()
                    );
                    return ResponseEntity.ok(response);
                }
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        String username = (String) session.getAttribute("username");
        String role = (String) session.getAttribute("role");
        
        if (username != null) {
            LoginResponse response = new LoginResponse(username, "Authenticated", role);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER");
        
        userRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully");
    }
}