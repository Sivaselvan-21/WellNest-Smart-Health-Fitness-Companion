package com.healthwellness.controller;

import com.healthwellness.model.BMIHistory;
import com.healthwellness.model.BMIRequest;
import com.healthwellness.repository.BMIHistoryRepository;
import com.healthwellness.repository.UserRepository;
import com.healthwellness.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bmi")
@CrossOrigin(origins = "http://localhost:3000")
public class BMIController {

    @Autowired
    private BMIHistoryRepository bmiHistoryRepository;

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

    // Calculate BMI and save to MongoDB
    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody BMIRequest request) {
        try {
            String userId = getUserIdFromToken(authHeader);

            double heightInMeters = request.getHeight() / 100;
            double bmi = request.getWeight() / (heightInMeters * heightInMeters);

            String category;
            if (bmi < 18.5) {
                category = "Underweight";
            } else if (bmi < 25) {
                category = "Normal";
            } else {
                category = "Overweight";
            }

            BMIHistory record = new BMIHistory(
                    request.getHeight(),
                    request.getWeight(),
                    bmi,
                    category
            );
            record.setUserId(userId);
            record.setCreatedAt(new Date());

            bmiHistoryRepository.save(record);

            Map<String, Object> result = new HashMap<>();
            result.put("bmi", bmi);
            result.put("category", category);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get BMI history for logged-in user
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = getUserIdFromToken(authHeader);
            List<BMIHistory> history = bmiHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a BMI record
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            bmiHistoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "BMI record deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public String test() {
        return "BMI API Working!";
    }
}