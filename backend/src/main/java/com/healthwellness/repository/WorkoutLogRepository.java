package com.healthwellness.repository;

import com.healthwellness.model.WorkoutLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends MongoRepository<WorkoutLog, String> {
    List<WorkoutLog> findByUserId(String userId);
    List<WorkoutLog> findByUserIdAndDateBetween(String userId, Date start, Date end);
}