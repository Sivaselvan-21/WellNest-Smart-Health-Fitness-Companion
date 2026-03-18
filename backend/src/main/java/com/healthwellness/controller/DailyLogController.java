package com.healthwellness.controller;

import com.healthwellness.model.DailyLog;
import com.healthwellness.service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/daily-log")
@CrossOrigin(origins = "*")
public class DailyLogController {

    @Autowired
    private DailyLogService dailyLogService;

    // ✅ Add daily log
    @PostMapping
    public DailyLog addLog(@RequestBody DailyLog log) {
        return dailyLogService.saveLog(log);
    }

    // ✅ Get logs by email
    @GetMapping("api/{email}")
    public List<DailyLog> getLogs(@PathVariable String email) {
        return dailyLogService.getLogsByEmail(email);
    }

    // ✅ Delete log
    @DeleteMapping("api/{id}")
    public String deleteLog(@PathVariable String id) {
        dailyLogService.deleteLog(id);
        return "Log deleted successfully";
    }
}
