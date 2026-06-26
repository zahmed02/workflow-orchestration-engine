package com.workflow.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int priority;  // higher = more important

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToMany
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private List<Task> dependencies = new ArrayList<>();

    // Constructors, getters, setters...
    public Task() {}

    public Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
        this.status = TaskStatus.PENDING;
    }

    // Getters and setters (omitted for brevity, but you must generate them)
    // I'll list them below.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public List<Task> getDependencies() { return dependencies; }
    public void setDependencies(List<Task> dependencies) { this.dependencies = dependencies; }
}