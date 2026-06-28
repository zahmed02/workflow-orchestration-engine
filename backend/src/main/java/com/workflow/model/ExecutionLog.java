package com.workflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ExecutionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Task task;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String result;
    private String details;

    // User association
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public ExecutionLog() {}

    public ExecutionLog(Task task, String result) {
        this.task = task;
        this.result = result;
        this.startTime = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}