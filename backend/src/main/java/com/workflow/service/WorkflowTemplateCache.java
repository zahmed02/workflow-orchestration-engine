package com.workflow.service;

import com.workflow.ds.AvlTree;
import com.workflow.model.Workflow;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class WorkflowTemplateCache {
    private final AvlTree<String, Workflow> cache = new AvlTree<>();
    private final Set<String> templateNames = new HashSet<>();

    public void put(String templateName, Workflow workflow) {
        cache.insert(templateName, workflow);
        templateNames.add(templateName);
    }

    public Workflow get(String templateName) {
        return cache.search(templateName);
    }

    public void remove(String templateName) {
        cache.delete(templateName);
        templateNames.remove(templateName);
    }

    public Set<String> getAllNames() {
        return new HashSet<>(templateNames);
    }
}