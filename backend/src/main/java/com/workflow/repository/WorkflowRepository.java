package com.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workflow.model.Workflow;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
}