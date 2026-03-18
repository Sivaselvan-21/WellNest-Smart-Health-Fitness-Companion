package com.healthwellness.controller;

import com.healthwellness.model.WaterLog;
import com.healthwellness.repository.WaterLogRepository;
import com.healthwellness.repository.UserRepository;
import com.healthwellness.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/water")
@CrossOrigin(origins = "http://localhost:3000")
public class WaterController {

    @Autowired
    private WaterLogRepository waterLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private String extractEmailFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractEmail(token);
    }

    private String getUserIdFromToken(String authHeader) {
        String email = extractEmailFromToken(authHeader);
        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Save a new water log
    @PostMapping("/log")
    public ResponseEntity<?> logWater(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody WaterLog waterLog) {
        try {
            String userId = getUserIdFromToken(authHeader);
            waterLog.setUserId(userId);
            waterLog.setCreatedAt(new Date());
            WaterLog saved = waterLogRepository.save(waterLog);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all water logs for user
    @GetMapping("/logs")
    public ResponseEntity<?> getWaterLogs(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = getUserIdFromToken(authHeader);
            List<WaterLog> logs = waterLogRepository.findByUserId(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a water log
    @DeleteMapping("/log/{id}")
    public ResponseEntity<?> deleteWaterLog(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            waterLogRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Water log deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}