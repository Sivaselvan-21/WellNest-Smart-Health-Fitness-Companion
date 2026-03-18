package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "workout_logs")
public class WorkoutLog {

    @Id
    private String id;

    private String userId;
    private String exerciseType;
    private String exerciseName;
    private Integer duration;
    private Integer caloriesBurned;
    private String notes;
    private Date date;
    private Date createdAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }

    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}