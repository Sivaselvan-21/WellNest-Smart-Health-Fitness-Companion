package com.healthwellness.repository;

import com.healthwellness.model.DailyLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DailyLogRepository extends MongoRepository<DailyLog, String> {

    List<DailyLog> findByEmail(String email);

}
