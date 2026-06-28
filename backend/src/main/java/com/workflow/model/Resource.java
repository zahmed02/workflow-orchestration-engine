package com.workflow.model;

import jakarta.persistence.*;

@Entity
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double total;
    private double available;

    // User association
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

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
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}