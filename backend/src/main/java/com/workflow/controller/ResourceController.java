package com.workflow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflow.model.Resource;
import com.workflow.repository.ResourceRepository;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {
    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @PostMapping
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        Resource saved = resourceRepository.save(resource);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @GetMapping("/{name}")
    public ResponseEntity<Resource> getResourceByName(@PathVariable String name) {
        Resource resource = resourceRepository.findByName(name).orElse(null);
        return resource != null ? ResponseEntity.ok(resource) : ResponseEntity.notFound().build();
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resource.setId(id);
        Resource updated = resourceRepository.save(resource);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}