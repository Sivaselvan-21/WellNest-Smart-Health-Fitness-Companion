package com.healthwellness.service;

import com.healthwellness.model.WorkoutLog;
import com.healthwellness.repository.WorkoutLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

    public WorkoutLog logWorkout(WorkoutLog workoutLog, String userId) {
        workoutLog.setUserId(userId);
        workoutLog.setDate(new Date());
        return workoutLogRepository.save(workoutLog);
    }

    public List<WorkoutLog> getLogs(String userId) {
        return workoutLogRepository.findByUserId(userId)
            .stream()
            .sorted(Comparator.comparing(WorkoutLog::getDate).reversed())
            .collect(Collectors.toList());
    }

    public void deleteLog(String id, String userId) {
        WorkoutLog log = workoutLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Workout log not found"));
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        workoutLogRepository.deleteById(id);
    }
}