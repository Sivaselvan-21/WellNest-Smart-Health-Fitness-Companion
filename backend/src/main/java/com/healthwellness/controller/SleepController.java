package com.healthwellness.controller;

import com.healthwellness.model.SleepLog;
import com.healthwellness.repository.SleepLogRepository;
import com.healthwellness.repository.UserRepository;
import com.healthwellness.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sleep")
@CrossOrigin(origins = "http://localhost:3000")
public class SleepController {

    @Autowired
    private SleepLogRepository sleepLogRepository;

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

    // Save a new sleep log
    @PostMapping("/log")
    public ResponseEntity<?> logSleep(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SleepLog sleepLog) {
        try {
            String userId = getUserIdFromToken(authHeader);
            sleepLog.setUserId(userId);
            sleepLog.setCreatedAt(new Date());
            SleepLog saved = sleepLogRepository.save(sleepLog);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all sleep logs for user
    @GetMapping("/logs")
    public ResponseEntity<?> getSleepLogs(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = getUserIdFromToken(authHeader);
            List<SleepLog> logs = sleepLogRepository.findByUserId(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a sleep log
    @DeleteMapping("/log/{id}")
    public ResponseEntity<?> deleteSleepLog(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            sleepLogRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Sleep log deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}