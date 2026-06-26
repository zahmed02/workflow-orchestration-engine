package com.workflow.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.workflow.model.Resource;
import com.workflow.service.ResourceManager;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ResourceManager resourceManager;

    public DataInitializer(ResourceManager resourceManager) {
        this.resourceManager = resourceManager;
    }

    @Override
    public void run(String... args) {
        // Add a default CPU resource
        if (resourceManager.getResource("CPU") == null) {
            resourceManager.addResource(new Resource("CPU", 4.0));
        }
    }
}