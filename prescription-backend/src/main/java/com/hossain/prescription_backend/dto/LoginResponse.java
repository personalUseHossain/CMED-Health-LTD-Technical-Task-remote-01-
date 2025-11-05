package com.hossain.prescription_backend.dto;

public class LoginResponse {
    private String username;
    private String message;
    private String role;

    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String username, String message, String role) {
        this.username = username;
        this.message = message;
        this.role = role;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}