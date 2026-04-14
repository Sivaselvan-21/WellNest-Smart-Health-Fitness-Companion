package com.healthwellness.service;

import com.healthwellness.model.WaterLog;
import com.healthwellness.repository.WaterLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WaterService {

    @Autowired
    private WaterLogRepository waterLogRepository;

    public WaterLog logWater(WaterLog waterLog, String userId) {
        waterLog.setUserId(userId);
        waterLog.setDate(new Date());
        return waterLogRepository.save(waterLog);
    }

    public List<WaterLog> getLogs(String userId) {
        return waterLogRepository.findByUserId(userId)
            .stream()
            .sorted(Comparator.comparing(WaterLog::getDate).reversed())
            .collect(Collectors.toList());
    }

    public void deleteLog(String id, String userId) {
        WaterLog log = waterLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Water log not found"));
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        waterLogRepository.deleteById(id);
    }
}