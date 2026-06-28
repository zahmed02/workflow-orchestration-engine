package com.workflow.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.model.User;
import com.workflow.repository.TaskRepository;
import com.workflow.service.UndoManager;
import com.workflow.util.SecurityUtils;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final UndoManager undoManager;
    private final SecurityUtils securityUtils;

    public TaskController(TaskRepository taskRepository,
                          UndoManager undoManager,
                          SecurityUtils securityUtils) {
        this.taskRepository = taskRepository;
        this.undoManager = undoManager;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        User currentUser = securityUtils.getCurrentUser();
        task.setUser(currentUser);
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Task> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        User currentUser = securityUtils.getCurrentUser();

        if (status != null && !status.isEmpty()) {
            TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
            if (search != null && !search.isEmpty()) {
                return taskRepository.findByUserAndStatusAndNameContainingIgnoreCase(
                        currentUser, taskStatus, search);
            }
            return taskRepository.findByUserAndStatus(currentUser, taskStatus);
        }
        if (search != null && !search.isEmpty()) {
            return taskRepository.findByUserAndNameContainingIgnoreCase(currentUser, search);
        }
        return taskRepository.findByUser(currentUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        // We can add check to ensure task belongs to current user, but let's keep simple for now.
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        task.setId(id);
        // Ensure the task belongs to the current user before update? Not required if we only allow their own.
        User currentUser = securityUtils.getCurrentUser();
        Task existing = taskRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        task.setUser(currentUser);
        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        User currentUser = securityUtils.getCurrentUser();
        Task existing = taskRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/undo")
    public ResponseEntity<Task> undoTask(@PathVariable Long id) {
        User currentUser = securityUtils.getCurrentUser();
        Task existing = taskRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }

        Task undone = undoManager.undo();
        if (undone != null) {
            existing.setName(undone.getName());
            existing.setPriority(undone.getPriority());
            existing.setStatus(undone.getStatus());
            existing.setDependencies(undone.getDependencies());
            Task saved = taskRepository.save(existing);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
}