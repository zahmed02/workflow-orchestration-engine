package com.workflow.controller;

import com.workflow.dto.WorkflowRequest;
import com.workflow.model.Task;
import com.workflow.model.Workflow;
import com.workflow.repository.TaskRepository;
import com.workflow.repository.WorkflowRepository;
import com.workflow.service.ExecutionService;
import com.workflow.service.WorkflowService;
import com.workflow.service.WorkflowTemplateCache;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {
    private final WorkflowService workflowService;
    private final ExecutionService executionService;
    private final TaskRepository taskRepository;
    private final WorkflowRepository workflowRepository;
    private final WorkflowTemplateCache templateCache;

    public WorkflowController(WorkflowService workflowService,
                              ExecutionService executionService,
                              TaskRepository taskRepository,
                              WorkflowRepository workflowRepository,
                              WorkflowTemplateCache templateCache) {
        this.workflowService = workflowService;
        this.executionService = executionService;
        this.taskRepository = taskRepository;
        this.workflowRepository = workflowRepository;
        this.templateCache = templateCache;
    }

    @PostMapping
    @Transactional   // ADDED – ensures the entity manager stays open for saving
    public ResponseEntity<Workflow> createWorkflow(@RequestBody WorkflowRequest request) {
        Workflow workflow = new Workflow();
        workflow.setName(request.getName());
        List<Task> tasks = taskRepository.findAllById(request.getTaskIds());
        workflow.setTasks(tasks);
        Workflow saved = workflowService.saveWorkflow(workflow);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable Long id) {
        Workflow workflow = workflowService.getWorkflow(id);
        return workflow != null ? ResponseEntity.ok(workflow) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<String> executeWorkflow(@PathVariable Long id) {
        Workflow workflow = workflowService.getWorkflow(id);
        if (workflow == null) {
            return ResponseEntity.notFound().build();
        }
        workflowService.buildAndExecuteWorkflow(workflow);
        executionService.executeWorkflow(workflow);
        return ResponseEntity.ok("Workflow execution started");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        if (!workflowRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        workflowRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- Template endpoints ---

    @GetMapping("/templates")
    public Set<String> getAllTemplateNames() {
        return templateCache.getAllNames();
    }

    @PostMapping("/templates/{name}")
    public ResponseEntity<String> saveTemplate(@PathVariable String name, @RequestBody Workflow workflow) {
        templateCache.put(name, workflow);
        return ResponseEntity.ok("Template saved: " + name);
    }

    @GetMapping("/templates/{name}")
    public ResponseEntity<Workflow> getTemplate(@PathVariable String name) {
        Workflow template = templateCache.get(name);
        return template != null ? ResponseEntity.ok(template) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/templates/{name}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String name) {
        templateCache.remove(name);
        return ResponseEntity.noContent().build();
    }
}
