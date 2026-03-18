package com.healthwellness.controller;

import com.healthwellness.model.ProfileRequest;
import com.healthwellness.model.User;
import com.healthwellness.service.JwtService;
import com.healthwellness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    private String extractEmailFromToken(String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        return jwtService.extractEmail(token);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            var userOpt = userService.getUserByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ProfileRequest request) {
        try {
            String email = extractEmailFromToken(authHeader);
            User updatedUser = userService.updateProfile(email, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
