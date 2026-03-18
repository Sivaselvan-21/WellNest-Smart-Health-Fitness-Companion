package com.healthwellness.repository;

import com.healthwellness.model.Meal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MealRepository extends MongoRepository<Meal, String> {

    List<Meal> findByEmail(String email);

}
