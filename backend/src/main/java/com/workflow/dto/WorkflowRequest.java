package com.workflow.dto;

import java.util.List;

public class WorkflowRequest {
    private String name;
    private List<Long> taskIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(List<Long> taskIds) {
        this.taskIds = taskIds;
    }
}