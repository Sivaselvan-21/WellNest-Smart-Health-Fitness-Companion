package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "workouts")
public class Workout {

    @Id
    private String id;

    private String email;
    private String exerciseType;
    private Integer duration;
    private Integer caloriesBurned;
    private Date date = new Date();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
}
