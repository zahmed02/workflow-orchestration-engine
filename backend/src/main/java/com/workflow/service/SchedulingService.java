package com.workflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workflow.ds.MaxHeap;
import com.workflow.model.Task;
import com.workflow.model.TaskStatus;

@Service
public class SchedulingService {
    private final MaxHeap priorityHeap = new MaxHeap();

    /**
     * Adds a list of tasks to the heap (only if they are READY).
     */
    public void enqueueReadyTasks(List<Task> tasks) {
        for (Task t : tasks) {
            if (t.getStatus() == TaskStatus.READY) {
                priorityHeap.insert(t);
            }
        }
    }

    /**
     * Picks the highest priority task and marks it as RUNNING.
     */
    public Task pickNextTask() {
        Task next = priorityHeap.extractMax();
        if (next != null) {
            next.setStatus(TaskStatus.RUNNING);
        }
        return next;
    }

    /**
     * Re-insert a task back into heap (e.g., if it was blocked).
     */
    public void reinsertTask(Task task) {
        if (task.getStatus() == TaskStatus.READY) {
            priorityHeap.insert(task);
        }
    }

    public boolean hasPendingTasks() {
        return !priorityHeap.isEmpty();
    }

    public int getQueueSize() {
        return priorityHeap.size();
    }
}