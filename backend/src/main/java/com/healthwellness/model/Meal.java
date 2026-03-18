package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "meals")
public class Meal {

    @Id
    private String id;

    private String email;
    private String mealType;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private Date date = new Date();

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Integer getProtein() {
        return protein;
    }

    public void setProtein(Integer protein) {
        this.protein = protein;
    }

    public Integer getCarbs() {
        return carbs;
    }

    public void setCarbs(Integer carbs) {
        this.carbs = carbs;
    }

    public Integer getFats() {
        return fats;
    }

    public void setFats(Integer fats) {
        this.fats = fats;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
