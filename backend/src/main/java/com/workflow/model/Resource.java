package com.workflow.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double total;
    private double available;

    public Resource() {}

    public Resource(String name, double total) {
        this.name = name;
        this.total = total;
        this.available = total;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public double getAvailable() { return available; }
    public void setAvailable(double available) { this.available = available; }
}