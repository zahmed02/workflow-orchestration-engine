package com.workflow.ds;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import com.workflow.model.Task;

public class UndoStack {
    private final Stack<Task> history = new Stack<>();

    public void push(Task task) {
        history.push(task);
    }

    public Task pop() {
        return history.isEmpty() ? null : history.pop();
    }

    public Task peek() {
        return history.isEmpty() ? null : history.peek();
    }

    public boolean isEmpty() {
        return history.isEmpty();
    }

    public void clear() {
        history.clear();
    }

    // NEW: get all tasks (bottom to top)
    public List<Task> getAll() {
        return new ArrayList<>(history);
    }
}