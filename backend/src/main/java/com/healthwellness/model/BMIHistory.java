package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "bmi_history")
public class BMIHistory {

    @Id
    private String id;

    private String userId;
    private double height;
    private double weight;
    private double bmi;
    private String category;
    private Date createdAt;

    public BMIHistory() {}

    public BMIHistory(double height, double weight, double bmi, String category) {
        this.height = height;
        this.weight = weight;
        this.bmi = bmi;
        this.category = category;
    }

    // Getters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public double getHeight() { return height; }
    public double getWeight() { return weight; }
    public double getBmi() { return bmi; }
    public String getCategory() { return category; }
    public Date getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setHeight(double height) { this.height = height; }
    public void setWeight(double weight) { this.weight = weight; }
    public void setBmi(double bmi) { this.bmi = bmi; }
    public void setCategory(String category) { this.category = category; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}