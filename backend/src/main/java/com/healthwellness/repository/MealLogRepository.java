package com.healthwellness.repository;

import com.healthwellness.model.MealLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface MealLogRepository extends MongoRepository<MealLog, String> {
    List<MealLog> findByUserId(String userId);
    List<MealLog> findByUserIdAndDateBetween(String userId, Date start, Date end);
    List<MealLog> findByUserIdAndMealType(String userId, String mealType);
}