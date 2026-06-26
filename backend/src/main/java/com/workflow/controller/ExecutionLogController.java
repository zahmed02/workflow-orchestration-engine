package com.workflow.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflow.model.ExecutionLog;
import com.workflow.repository.ExecutionLogRepository;

@RestController
@RequestMapping("/api/logs")
public class ExecutionLogController {
    private final ExecutionLogRepository executionLogRepository;

    public ExecutionLogController(ExecutionLogRepository executionLogRepository) {
        this.executionLogRepository = executionLogRepository;
    }

    @GetMapping("/recent")
    public List<ExecutionLog> getRecentLogs() {
        return executionLogRepository.findTop10ByOrderByStartTimeDesc();
    }
}