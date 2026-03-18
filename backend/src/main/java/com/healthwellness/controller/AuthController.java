package com.healthwellness.controller;

import com.healthwellness.model.*;
import com.healthwellness.service.JwtService;
import com.healthwellness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            var user = userService.registerUser(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful. OTP sent to email.");
            response.put("email", user.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            var user = userService.verifyEmail(email, otp);
            String token = jwtService.generateToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email verified successfully");
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            var user = userService.loginUser(request.getEmail(), request.getPassword());
            String token = jwtService.generateToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.initiatePasswordReset(email);
            return ResponseEntity.ok(Map.of("message", "Password reset OTP sent to email"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword = request.get("newPassword");
            
            var user = userService.resetPassword(email, otp, newPassword);
            String token = jwtService.generateToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successful");
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
