package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "sleep_logs")
public class SleepLog {

    @Id
    private String id;

    private String userId;
    private String bedtime;
    private String wakeTime;
    private Double duration;
    private String quality;
    private String notes;
    private Date date;
    private Date createdAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getBedtime() { return bedtime; }
    public void setBedtime(String bedtime) { this.bedtime = bedtime; }

    public String getWakeTime() { return wakeTime; }
    public void setWakeTime(String wakeTime) { this.wakeTime = wakeTime; }

    public Double getDuration() { return duration; }
    public void setDuration(Double duration) { this.duration = duration; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}