package com.workflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workflow.model.Task;
import com.workflow.model.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByNameContainingIgnoreCase(String name);
    List<Task> findByStatusAndNameContainingIgnoreCase(TaskStatus status, String name);
}