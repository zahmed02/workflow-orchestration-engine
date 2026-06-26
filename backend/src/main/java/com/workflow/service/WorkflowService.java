package com.workflow.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workflow.ds.AdjacencyListGraph;
import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.model.Workflow;
import com.workflow.repository.WorkflowRepository;

@Service
public class WorkflowService {
    private final WorkflowRepository workflowRepository;

    public WorkflowService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    /**
     * Builds the dependency graph from a workflow and updates task statuses.
     * Returns the topological order of task IDs.
     */
    @Transactional
    public List<Long> buildAndExecuteWorkflow(Workflow workflow) {
        AdjacencyListGraph graph = new AdjacencyListGraph();
        // Build graph from task dependencies
        for (Task task : workflow.getTasks()) {
            for (Task dep : task.getDependencies()) {
                graph.addEdge(dep.getId(), task.getId());
            }
        }
        // Topological sort
        List<Long> order = graph.topologicalSort();

        // Mark tasks as READY when all dependencies are done
        for (Task task : workflow.getTasks()) {
            if (task.getDependencies().isEmpty()) {
                task.setStatus(TaskStatus.READY);
            } else {
                task.setStatus(TaskStatus.PENDING);
            }
        }
        workflowRepository.save(workflow);
        return order;
    }

    // Added @Transactional here
    @Transactional
    public Workflow saveWorkflow(Workflow workflow) {
        return workflowRepository.save(workflow);
    }

    public Workflow getWorkflow(Long id) {
        return workflowRepository.findById(id).orElse(null);
    }
}