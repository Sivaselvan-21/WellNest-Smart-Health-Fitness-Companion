package com.healthwellness.service;

import com.healthwellness.model.DailyLog;
import com.healthwellness.repository.DailyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DailyLogService {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    public DailyLog saveLog(DailyLog log) {
        return dailyLogRepository.save(log);
    }

    public List<DailyLog> getLogsByEmail(String email) {
        return dailyLogRepository.findByEmail(email);
    }

    public void deleteLog(String id) {
        dailyLogRepository.deleteById(id);
    }
}
