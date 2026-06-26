package com.workflow.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.workflow.model.Task;
import com.workflow.model.TaskStatus;
import com.workflow.model.Workflow;
import com.workflow.repository.TaskRepository;
import com.workflow.repository.WorkflowRepository;
import com.workflow.service.WorkflowService;

@Component
public class DataLoader implements CommandLineRunner {

    private final TaskRepository taskRepository;
    private final WorkflowRepository workflowRepository;
    private final WorkflowService workflowService;

    public DataLoader(TaskRepository taskRepository,
                      WorkflowRepository workflowRepository,
                      WorkflowService workflowService) {
        this.taskRepository = taskRepository;
        this.workflowRepository = workflowRepository;
        this.workflowService = workflowService;
    }

    @Override
    public void run(String... args) {
        // Only seed if database is completely empty
        if (taskRepository.count() > 0) {
            System.out.println("Database already has " + taskRepository.count() + " tasks. Skipping seed.");
            return;
        }

        System.out.println("Seeding database with real tasks and workflows...");

        // ============================================================
        // DATA PIPELINE WORKFLOW (5 tasks, linear dependencies)
        // ============================================================

        Task extract = new Task("Extract Data", 8);
        extract.setStatus(TaskStatus.PENDING);

        Task transform = new Task("Transform Data", 7);
        transform.setStatus(TaskStatus.PENDING);

        Task load = new Task("Load to Warehouse", 6);
        load.setStatus(TaskStatus.PENDING);

        Task generateReports = new Task("Generate Reports", 9);
        generateReports.setStatus(TaskStatus.PENDING);

        Task sendNotifications = new Task("Send Notifications", 4);
        sendNotifications.setStatus(TaskStatus.PENDING);

        // Save Data Pipeline tasks first
        List<Task> pipelineTasks = taskRepository.saveAll(List.of(
                extract, transform, load, generateReports, sendNotifications
        ));

        // Set dependencies: Extract -> Transform -> Load -> Generate Reports -> Send Notifications
        pipelineTasks.get(1).setDependencies(List.of(pipelineTasks.get(0)));  // Transform depends on Extract
        pipelineTasks.get(2).setDependencies(List.of(pipelineTasks.get(1)));  // Load depends on Transform
        pipelineTasks.get(3).setDependencies(List.of(pipelineTasks.get(2)));  // Generate Reports depends on Load
        pipelineTasks.get(4).setDependencies(List.of(pipelineTasks.get(3)));  // Send Notifications depends on Generate Reports

        taskRepository.saveAll(pipelineTasks);

        // Create Data Pipeline Workflow
        Workflow dataPipeline = new Workflow();
        dataPipeline.setName("Data Pipeline");
        dataPipeline.setTasks(pipelineTasks);
        workflowService.saveWorkflow(dataPipeline);

        System.out.println("Data Pipeline workflow created with " + pipelineTasks.size() + " tasks.");

        // ============================================================
        // EMAIL CAMPAIGN WORKFLOW (5 tasks, parallel roots + convergence)
        // ============================================================

        Task createEmailList = new Task("Create Email List", 3);
        createEmailList.setStatus(TaskStatus.PENDING);

        Task designTemplate = new Task("Design Template", 2);
        designTemplate.setStatus(TaskStatus.PENDING);

        Task draftContent = new Task("Draft Content", 4);
        draftContent.setStatus(TaskStatus.PENDING);

        Task sendCampaign = new Task("Send Campaign", 7);
        sendCampaign.setStatus(TaskStatus.PENDING);

        Task trackAnalytics = new Task("Track Analytics", 5);
        trackAnalytics.setStatus(TaskStatus.PENDING);

        // Save Email Campaign tasks
        List<Task> emailTasks = taskRepository.saveAll(List.of(
                createEmailList, designTemplate, draftContent, sendCampaign, trackAnalytics
        ));

        // Set dependencies: Send Campaign depends on all three roots (Email List, Template, Content)
        // Track Analytics depends on Send Campaign
        emailTasks.get(3).setDependencies(List.of(
                emailTasks.get(0),  // Create Email List
                emailTasks.get(1),  // Design Template
                emailTasks.get(2)   // Draft Content
        ));
        emailTasks.get(4).setDependencies(List.of(emailTasks.get(3)));  // Track Analytics depends on Send Campaign

        taskRepository.saveAll(emailTasks);

        // Create Email Campaign Workflow
        Workflow emailCampaign = new Workflow();
        emailCampaign.setName("Email Campaign");
        emailCampaign.setTasks(emailTasks);
        workflowService.saveWorkflow(emailCampaign);

        System.out.println("Email Campaign workflow created with " + emailTasks.size() + " tasks.");

        // ============================================================
        // SECURITY AUDIT WORKFLOW (5 tasks, complex dependencies)
        // ============================================================

        Task scanPorts = new Task("Scan Ports", 6);
        scanPorts.setStatus(TaskStatus.PENDING);

        Task checkVulnerabilities = new Task("Check Vulnerabilities", 8);
        checkVulnerabilities.setStatus(TaskStatus.PENDING);

        Task testAuthentication = new Task("Test Authentication", 5);
        testAuthentication.setStatus(TaskStatus.PENDING);

        Task analyzeLogs = new Task("Analyze Logs", 4);
        analyzeLogs.setStatus(TaskStatus.PENDING);

        Task generateReport = new Task("Generate Report", 7);
        generateReport.setStatus(TaskStatus.PENDING);

        // Save Security Audit tasks
        List<Task> securityTasks = taskRepository.saveAll(List.of(
                scanPorts, checkVulnerabilities, testAuthentication, analyzeLogs, generateReport
        ));

        // Set dependencies: Check Vulnerabilities depends on Scan Ports
        // Test Authentication depends on Scan Ports
        // Analyze Logs depends on Check Vulnerabilities AND Test Authentication
        // Generate Report depends on Analyze Logs
        securityTasks.get(1).setDependencies(List.of(securityTasks.get(0)));  // Check Vulnerabilities depends on Scan Ports
        securityTasks.get(2).setDependencies(List.of(securityTasks.get(0)));  // Test Authentication depends on Scan Ports
        securityTasks.get(3).setDependencies(List.of(
                securityTasks.get(1),  // Check Vulnerabilities
                securityTasks.get(2)   // Test Authentication
        ));
        securityTasks.get(4).setDependencies(List.of(securityTasks.get(3)));  // Generate Report depends on Analyze Logs

        taskRepository.saveAll(securityTasks);

        // Create Security Audit Workflow
        Workflow securityAudit = new Workflow();
        securityAudit.setName("Security Audit");
        securityAudit.setTasks(securityTasks);
        workflowService.saveWorkflow(securityAudit);

        System.out.println("Security Audit workflow created with " + securityTasks.size() + " tasks.");

        // ============================================================
        // PRIORITY TEST WORKFLOW (6 tasks, varying priorities)
        // ============================================================

        Task rootLow = new Task("A - Root (Low)", 1);
        rootLow.setStatus(TaskStatus.PENDING);

        Task rootHigh = new Task("B - Root (High)", 10);
        rootHigh.setStatus(TaskStatus.PENDING);

        Task rootMedium = new Task("C - Root (Medium)", 5);
        rootMedium.setStatus(TaskStatus.PENDING);

        Task depB = new Task("D - Depends on B", 8);
        depB.setStatus(TaskStatus.PENDING);

        Task depA = new Task("E - Depends on A", 3);
        depA.setStatus(TaskStatus.PENDING);

        Task depBAndC = new Task("F - Depends on B & C", 7);
        depBAndC.setStatus(TaskStatus.PENDING);

        // Save Priority Test tasks
        List<Task> priorityTasks = taskRepository.saveAll(List.of(
                rootLow, rootHigh, rootMedium, depB, depA, depBAndC
        ));

        // Set dependencies
        priorityTasks.get(3).setDependencies(List.of(priorityTasks.get(1)));  // D depends on B
        priorityTasks.get(4).setDependencies(List.of(priorityTasks.get(0)));  // E depends on A
        priorityTasks.get(5).setDependencies(List.of(
                priorityTasks.get(1),  // B
                priorityTasks.get(2)   // C
        ));

        taskRepository.saveAll(priorityTasks);

        // Create Priority Test Workflow
        Workflow priorityTest = new Workflow();
        priorityTest.setName("Priority Test");
        priorityTest.setTasks(priorityTasks);
        workflowService.saveWorkflow(priorityTest);

        System.out.println("Priority Test workflow created with " + priorityTasks.size() + " tasks.");

        // ============================================================
        // SUMMARY
        // ============================================================
        long totalTasks = taskRepository.count();
        long totalWorkflows = workflowRepository.count();

        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        System.out.println("SEED COMPLETE");
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        System.out.println("Total Tasks Seeded:      " + totalTasks);
        System.out.println("Total Workflows Seeded:  " + totalWorkflows);
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        System.out.println("Workflows:");
        System.out.println("  • Data Pipeline      (5 tasks, linear)");
        System.out.println("  • Email Campaign     (5 tasks, parallel roots)");
        System.out.println("  • Security Audit     (5 tasks, complex dependencies)");
        System.out.println("  • Priority Test      (6 tasks, mixed priorities)");
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
}