package com.healthwellness.repository;

import com.healthwellness.model.SleepLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface SleepLogRepository extends MongoRepository<SleepLog, String> {
    List<SleepLog> findByUserId(String userId);
    List<SleepLog> findByUserIdAndDateBetween(String userId, Date start, Date end);
}