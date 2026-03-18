package com.healthwellness.controller;

import com.healthwellness.model.WorkoutLog;
import com.healthwellness.repository.WorkoutLogRepository;
import com.healthwellness.repository.UserRepository;
import com.healthwellness.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workout")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkoutController {

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

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

    // Save a new workout log
    @PostMapping("/log")
    public ResponseEntity<?> logWorkout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody WorkoutLog workoutLog) {
        try {
            String userId = getUserIdFromToken(authHeader);
            workoutLog.setUserId(userId);
            workoutLog.setCreatedAt(new Date());
            WorkoutLog saved = workoutLogRepository.save(workoutLog);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all workout logs for user
    @GetMapping("/logs")
    public ResponseEntity<?> getWorkoutLogs(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = getUserIdFromToken(authHeader);
            List<WorkoutLog> logs = workoutLogRepository.findByUserId(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a workout log
    @DeleteMapping("/log/{id}")
    public ResponseEntity<?> deleteWorkoutLog(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            workoutLogRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Workout log deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}