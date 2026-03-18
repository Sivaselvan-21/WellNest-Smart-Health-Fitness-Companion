package com.healthwellness.repository;

import com.healthwellness.model.WaterLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface WaterLogRepository extends MongoRepository<WaterLog, String> {
    List<WaterLog> findByUserId(String userId);
    List<WaterLog> findByUserIdAndDateBetween(String userId, Date start, Date end);
}