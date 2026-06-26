package com.workflow.ds;

import com.workflow.model.Task;
import java.util.ArrayList;
import java.util.List;

/**
 * A max-heap where the highest priority task is at the root.
 * Priority is determined by Task.getPriority().
 */
public class MaxHeap {
    private final List<Task> heap;

    public MaxHeap() {
        this.heap = new ArrayList<>();
    }

    public void insert(Task task) {
        heap.add(task);
        heapifyUp(heap.size() - 1);
    }

    public Task extractMax() {
        if (heap.isEmpty()) return null;
        Task max = heap.get(0);
        Task last = heap.remove(heap.size() - 1);
        if (!heap.isEmpty()) {
            heap.set(0, last);
            heapifyDown(0);
        }
        return max;
    }

    public Task peek() {
        return heap.isEmpty() ? null : heap.get(0);
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public int size() {
        return heap.size();
    }

    private void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (heap.get(index).getPriority() <= heap.get(parent).getPriority()) break;
            swap(index, parent);
            index = parent;
        }
    }

    private void heapifyDown(int index) {
        int size = heap.size();
        while (true) {
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            int largest = index;
            if (left < size && heap.get(left).getPriority() > heap.get(largest).getPriority())
                largest = left;
            if (right < size && heap.get(right).getPriority() > heap.get(largest).getPriority())
                largest = right;
            if (largest == index) break;
            swap(index, largest);
            index = largest;
        }
    }

    private void swap(int i, int j) {
        Task temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
}