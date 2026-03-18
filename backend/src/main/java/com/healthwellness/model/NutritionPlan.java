package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "nutrition_plans")
public class NutritionPlan {
    
    @Id
    private String id;
    private String userId;
    private String username;
    
    // User Info
    private Integer age;
    private String gender;
    private Double height; // in cm
    private Double weight; // in kg
    private String activityLevel;
    private String goal; // lose, maintain, gain
    private String dietPreference; // balanced, highProtein, lowCarb, keto
    private String allergies;
    
    // Calculated Data
    private Double bmi;
    private String bmiCategory;
    private String bmiStatus;
    
    // Nutrition Targets
    private Integer dailyCalories;
    private Macros macros;
    private Double waterIntake; // in liters
    
    // Meal Plan
    private Map<String, Meal> mealPlan;
    
    // Recommendations
    private List<String> recommendations;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    public static class Macros {
        private Integer protein; // in grams
        private Integer carbs; // in grams
        private Integer fat; // in grams
    }
    
    @Data
    public static class Meal {
        private String name;
        private Integer calories;
        private List<String> items;
    }
}