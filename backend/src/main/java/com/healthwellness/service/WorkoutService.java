package com.healthwellness.service;

import com.healthwellness.model.Workout;
import com.healthwellness.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    public Workout saveWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    public List<Workout> getUserWorkouts(String email) {
        return workoutRepository.findByEmail(email);
    }
}
