package com.healthwellness.service;

import com.healthwellness.model.Meal;
import com.healthwellness.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public Meal saveMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getMealsByEmail(String email) {
        return mealRepository.findByEmail(email);
    }

    public void deleteMeal(String id) {
        mealRepository.deleteById(id);
    }
}
