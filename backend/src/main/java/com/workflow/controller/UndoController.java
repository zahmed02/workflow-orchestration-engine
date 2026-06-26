package com.workflow.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflow.model.Task;
import com.workflow.service.UndoManager;

@RestController
@RequestMapping("/api/undo")
public class UndoController {
    private final UndoManager undoManager;

    public UndoController(UndoManager undoManager) {
        this.undoManager = undoManager;
    }

    @GetMapping("/history")
    public List<Task> getHistory() {
        return undoManager.getHistory();
    }
}