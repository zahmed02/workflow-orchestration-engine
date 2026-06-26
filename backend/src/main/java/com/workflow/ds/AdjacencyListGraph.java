package com.workflow.ds;

import java.util.*;

/**
 * Directed graph using adjacency list.
 * Supports adding edges and topological sorting.
 */
public class AdjacencyListGraph {
    private final Map<Long, List<Long>> adj = new HashMap<>();

    public void addEdge(Long from, Long to) {
        adj.computeIfAbsent(from, k -> new ArrayList<>()).add(to);
        // ensure target node exists even if it has no outgoing edges
        adj.computeIfAbsent(to, k -> new ArrayList<>());
    }

    public List<Long> getNeighbors(Long node) {
        return adj.getOrDefault(node, Collections.emptyList());
    }

    public Set<Long> getAllNodes() {
        return adj.keySet();
    }

    /**
     * Returns a topological order of all nodes.
     * Throws exception if cycle detected.
     */
    public List<Long> topologicalSort() {
        Map<Long, Integer> inDegree = new HashMap<>();
        for (Long node : adj.keySet()) {
            inDegree.put(node, 0);
        }
        for (List<Long> neighbors : adj.values()) {
            for (Long neighbor : neighbors) {
                inDegree.put(neighbor, inDegree.getOrDefault(neighbor, 0) + 1);
            }
        }

        Queue<Long> queue = new LinkedList<>();
        for (Map.Entry<Long, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
            }
        }

        List<Long> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            Long node = queue.poll();
            result.add(node);
            for (Long neighbor : adj.getOrDefault(node, Collections.emptyList())) {
                int newDegree = inDegree.get(neighbor) - 1;
                inDegree.put(neighbor, newDegree);
                if (newDegree == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        if (result.size() != adj.size()) {
            throw new IllegalStateException("Graph has a cycle");
        }
        return result;
    }
}