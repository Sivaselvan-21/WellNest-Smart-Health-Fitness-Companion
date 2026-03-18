package com.healthwellness.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class HealthTipController {

    @GetMapping("/api/tip")
    public Map<String, String> getDailyTip() {

        List<String> tips = List.of(
                "Stay hydrated and drink 8 glasses of water.",
                "Walk at least 30 minutes daily.",
                "Eat more fruits and vegetables.",
                "Get 7-8 hours of quality sleep.",
                "Practice mindfulness and reduce stress.",
                "Limit sugar intake today.",
                "Stretch your body in the morning."
        );

        int dayIndex = LocalDate.now().getDayOfYear() % tips.size();
        String todayTip = tips.get(dayIndex);

        return Map.of("tip", todayTip);
    }
}