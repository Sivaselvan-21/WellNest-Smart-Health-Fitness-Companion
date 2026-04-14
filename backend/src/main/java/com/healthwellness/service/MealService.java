package com.healthwellness.service;

import com.healthwellness.model.MealLog;
import com.healthwellness.repository.MealLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealService {

    @Autowired
    private MealLogRepository mealLogRepository;

    public MealLog logMeal(MealLog mealLog, String userId) {
        mealLog.setUserId(userId);
        mealLog.setDate(new Date());
        return mealLogRepository.save(mealLog);
    }

    public List<MealLog> getLogs(String userId) {
        return mealLogRepository.findByUserId(userId)
            .stream()
            .sorted(Comparator.comparing(MealLog::getDate).reversed())
            .collect(Collectors.toList());
    }

    public List<MealLog> getLogsByMealType(String userId, String mealType) {
        return mealLogRepository.findByUserIdAndMealType(userId, mealType)
            .stream()
            .sorted(Comparator.comparing(MealLog::getDate).reversed())
            .collect(Collectors.toList());
    }

    public void deleteLog(String id, String userId) {
        MealLog log = mealLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Meal log not found"));
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        mealLogRepository.deleteById(id);
    }
}