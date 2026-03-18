package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "water_logs")
public class WaterLog {

    @Id
    private String id;

    private String userId;
    private Double amount;
    private String unit;
    private Double liters;
    private String notes;
    private String time;
    private Date date;
    private Date createdAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getLiters() { return liters; }
    public void setLiters(Double liters) { this.liters = liters; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}