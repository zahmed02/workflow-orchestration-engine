package com.workflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.model.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Admin methods (global)
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByNameContainingIgnoreCase(String name);
    List<Task> findByStatusAndNameContainingIgnoreCase(TaskStatus status, String name);

    // User-specific methods (to isolate data per user)
    List<Task> findByUser(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    List<Task> findByUserAndNameContainingIgnoreCase(User user, String name);
    List<Task> findByUserAndStatusAndNameContainingIgnoreCase(User user, TaskStatus status, String name);
}