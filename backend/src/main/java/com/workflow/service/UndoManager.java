package com.workflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workflow.ds.UndoStack;
import com.workflow.model.Task;

@Service
public class UndoManager {
    private final UndoStack undoStack = new UndoStack();

    public void saveState(Task task) {
        undoStack.push(task);
        System.out.println("Saved state for task: " + task.getName());
    }

    public Task undo() {
        Task undone = undoStack.pop();
        if (undone != null) {
            System.out.println("Undo performed for task: " + undone.getName());
        }
        return undone;
    }

    public Task peekUndo() {
        return undoStack.peek();
    }

    public void clear() {
        undoStack.clear();
    }

    public boolean isEmpty() {
        return undoStack.isEmpty();
    }

    // NEW: get full history
    public List<Task> getHistory() {
        return undoStack.getAll();
    }
}