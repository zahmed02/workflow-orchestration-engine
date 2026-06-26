package com.workflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.workflow.model.Resource;
import com.workflow.repository.ResourceRepository;

@Service
public class ResourceManager {
    private final ResourceRepository resourceRepository;
    private final Map<String, Resource> resourceCache = new HashMap<>();

    public ResourceManager(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
        // Preload resources from DB into cache
        resourceRepository.findAll().forEach(r -> resourceCache.put(r.getName(), r));
    }

    /**
     * Allocates a specified amount from a resource.
     * Returns true if successful, false if insufficient.
     */
    public synchronized boolean allocate(String resourceName, double amount) {
        Resource resource = resourceCache.get(resourceName);
        if (resource == null) return false;
        if (resource.getAvailable() < amount) return false;
        resource.setAvailable(resource.getAvailable() - amount);
        resourceRepository.save(resource);
        return true;
    }

    public synchronized void release(String resourceName, double amount) {
        Resource resource = resourceCache.get(resourceName);
        if (resource != null) {
            double newAvail = Math.min(resource.getTotal(), resource.getAvailable() + amount);
            resource.setAvailable(newAvail);
            resourceRepository.save(resource);
        }
    }

    public Resource getResource(String name) {
        return resourceCache.get(name);
    }

    public void addResource(Resource resource) {
        resourceRepository.save(resource);
        resourceCache.put(resource.getName(), resource);
    }
}