package com.healthwellness.controller;

import com.healthwellness.model.MealLog;
import com.healthwellness.repository.MealLogRepository;
import com.healthwellness.repository.UserRepository;
import com.healthwellness.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meal")
@CrossOrigin(origins = "http://localhost:3000")
public class MealController {

    @Autowired
    private MealLogRepository mealLogRepository;

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

    // Save a new meal log
    @PostMapping("/log")
    public ResponseEntity<?> logMeal(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MealLog mealLog) {
        try {
            String userId = getUserIdFromToken(authHeader);
            mealLog.setUserId(userId);
            mealLog.setCreatedAt(new Date());
            MealLog saved = mealLogRepository.save(mealLog);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all meal logs for user
    @GetMapping("/logs")
    public ResponseEntity<?> getMealLogs(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = getUserIdFromToken(authHeader);
            List<MealLog> logs = mealLogRepository.findByUserId(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a meal log
    @DeleteMapping("/log/{id}")
    public ResponseEntity<?> deleteMealLog(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            mealLogRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Meal log deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}