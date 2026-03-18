package com.healthwellness.repository;

import com.healthwellness.model.BMIHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BMIHistoryRepository extends MongoRepository<BMIHistory, String> {

    List<BMIHistory> findByUserIdOrderByCreatedAtDesc(String userId);
}