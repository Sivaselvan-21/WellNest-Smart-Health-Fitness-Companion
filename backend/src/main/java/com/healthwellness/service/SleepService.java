package com.healthwellness.service;

import com.healthwellness.model.SleepLog;
import com.healthwellness.repository.SleepLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SleepService {

    @Autowired
    private SleepLogRepository sleepLogRepository;

    public SleepLog logSleep(SleepLog sleepLog, String userId) {
        sleepLog.setUserId(userId);
        sleepLog.setDate(new Date());
        return sleepLogRepository.save(sleepLog);
    }

    public List<SleepLog> getLogs(String userId) {
        return sleepLogRepository.findByUserId(userId)
            .stream()
            .sorted(Comparator.comparing(SleepLog::getDate).reversed())
            .collect(Collectors.toList());
    }

    public void deleteLog(String id, String userId) {
        SleepLog log = sleepLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sleep log not found"));
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        sleepLogRepository.deleteById(id);
    }
}
