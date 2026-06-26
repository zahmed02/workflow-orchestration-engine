package com.workflow.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.repository.TaskRepository;
import com.workflow.service.UndoManager;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final UndoManager undoManager;

    public TaskController(TaskRepository taskRepository, UndoManager undoManager) {
        this.taskRepository = taskRepository;
        this.undoManager = undoManager;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Task> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        if (status != null && !status.isEmpty()) {
            TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
            if (search != null && !search.isEmpty()) {
                return taskRepository.findByStatusAndNameContainingIgnoreCase(taskStatus, search);
            }
            return taskRepository.findByStatus(taskStatus);
        }
        if (search != null && !search.isEmpty()) {
            return taskRepository.findByNameContainingIgnoreCase(search);
        }
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
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
        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/undo")
    public ResponseEntity<Task> undoTask(@PathVariable Long id) {
        Task undone = undoManager.undo();
        if (undone != null) {
            // Since we want to apply undo to a specific task, we need to fetch and update it.
            // The undo stack stores the task state; we can copy fields to the existing task.
            Task existing = taskRepository.findById(id).orElse(null);
            if (existing != null) {
                existing.setName(undone.getName());
                existing.setPriority(undone.getPriority());
                existing.setStatus(undone.getStatus());
                existing.setDependencies(undone.getDependencies());
                Task saved = taskRepository.save(existing);
                return ResponseEntity.ok(saved);
            }
        }
        return ResponseEntity.notFound().build();
    }
}