package com.healthwellness.repository;


import com.healthwellness.model.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkoutRepository extends MongoRepository<Workout, String> {
    List<Workout> findByEmail(String email);

}
