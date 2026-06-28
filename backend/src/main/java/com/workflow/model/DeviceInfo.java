package com.workflow.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DeviceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String platform;          // e.g., "Win32", "MacIntel", "Linux armv8l"
    private String userAgent;         // Full user agent string
    private String deviceType;        // e.g., "Desktop", "Mobile", "Tablet"
    private int cpuCores;             // Number of logical CPU cores
    private double memoryTotal;       // Total RAM in GB
    private double memoryUsed;        // Used RAM in GB (simulated/approximate)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Constructors
    public DeviceInfo() {}

    public DeviceInfo(String platform, String userAgent, String deviceType, int cpuCores, double memoryTotal) {
        this.platform = platform;
        this.userAgent = userAgent;
        this.deviceType = deviceType;
        this.cpuCores = cpuCores;
        this.memoryTotal = memoryTotal;
        this.memoryUsed = 0.0;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public int getCpuCores() { return cpuCores; }
    public void setCpuCores(int cpuCores) { this.cpuCores = cpuCores; }

    public double getMemoryTotal() { return memoryTotal; }
    public void setMemoryTotal(double memoryTotal) { this.memoryTotal = memoryTotal; }

    public double getMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(double memoryUsed) { this.memoryUsed = memoryUsed; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}