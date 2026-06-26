package com.workflow.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workflow.model.ExecutionLog;
import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.model.Workflow;
import com.workflow.repository.ExecutionLogRepository;
import com.workflow.repository.TaskRepository;

@Service
public class ExecutionService {
    private final TaskRepository taskRepository;
    private final SchedulingService schedulingService;
    private final ResourceManager resourceManager;
    private final UndoManager undoManager;
    private final ExecutionLogRepository executionLogRepository;

    public ExecutionService(TaskRepository taskRepository,
                            SchedulingService schedulingService,
                            ResourceManager resourceManager,
                            UndoManager undoManager,
                            ExecutionLogRepository executionLogRepository) {
        this.taskRepository = taskRepository;
        this.schedulingService = schedulingService;
        this.resourceManager = resourceManager;
        this.undoManager = undoManager;
        this.executionLogRepository = executionLogRepository;
    }

    @Transactional
    public void executeWorkflow(Workflow workflow) {
        List<Task> readyTasks = workflow.getTasks().stream()
                .filter(t -> t.getStatus() == TaskStatus.READY)
                .toList();
        schedulingService.enqueueReadyTasks(readyTasks);

        while (schedulingService.hasPendingTasks()) {
            Task task = schedulingService.pickNextTask();
            if (task == null) break;

            // Save undo state
            undoManager.saveState(deepCopy(task));

            // Start log
            ExecutionLog log = new ExecutionLog(task, "RUNNING");
            log.setStartTime(LocalDateTime.now());
            executionLogRepository.save(log);

            boolean allocated = resourceManager.allocate("CPU", 1.0);
            if (!allocated) {
                task.setStatus(TaskStatus.READY);
                schedulingService.reinsertTask(task);
                log.setResult("RESOURCE_WAIT");
                log.setEndTime(LocalDateTime.now());
                executionLogRepository.save(log);
                continue;
            }

            try {
                System.out.println("Executing task: " + task.getName());
                Thread.sleep(1000); // simulate work
                task.setStatus(TaskStatus.COMPLETED);
                resourceManager.release("CPU", 1.0);
                log.setResult("COMPLETED");
                log.setEndTime(LocalDateTime.now());
                executionLogRepository.save(log);
                taskRepository.save(task);
                updateDependentTasks(workflow);
            } catch (InterruptedException e) {
                task.setStatus(TaskStatus.FAILED);
                resourceManager.release("CPU", 1.0);
                log.setResult("FAILED");
                log.setDetails(e.getMessage());
                log.setEndTime(LocalDateTime.now());
                executionLogRepository.save(log);
                taskRepository.save(task);
                break;
            }
        }
    }

    private void updateDependentTasks(Workflow workflow) {
        for (Task task : workflow.getTasks()) {
            if (task.getStatus() == TaskStatus.PENDING) {
                boolean allDepsDone = task.getDependencies().stream()
                        .allMatch(dep -> dep.getStatus() == TaskStatus.COMPLETED);
                if (allDepsDone) {
                    task.setStatus(TaskStatus.READY);
                    schedulingService.enqueueReadyTasks(List.of(task));
                }
            }
        }
        taskRepository.saveAll(workflow.getTasks());
    }

    // Helper to create a deep copy of a Task (to avoid reference pollution in UndoStack)
    private Task deepCopy(Task original) {
        Task copy = new Task();
        copy.setId(original.getId());
        copy.setName(original.getName());
        copy.setPriority(original.getPriority());
        copy.setStatus(original.getStatus());
        copy.setDependencies(original.getDependencies().stream().map(d -> {
            Task depCopy = new Task();
            depCopy.setId(d.getId());
            depCopy.setName(d.getName());
            return depCopy;
        }).toList());
        return copy;
    }
}