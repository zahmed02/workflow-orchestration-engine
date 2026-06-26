package com.workflow.ds;

/**
 * Simple AVL Tree for caching workflow templates by name (String key).
 * Stores any value type.
 */
public class AvlTree<K extends Comparable<K>, V> {
    private Node root;

    private class Node {
        K key;
        V value;
        Node left, right;
        int height;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
            this.height = 1;
        }
    }

    private int height(Node n) {
        return n == null ? 0 : n.height;
    }

    private int balance(Node n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    private Node rotateRight(Node y) {
        Node x = y.left;
        Node T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }

    private Node rotateLeft(Node x) {
        Node y = x.right;
        Node T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = 1 + Math.max(height(x.left), height(x.right));
        y.height = 1 + Math.max(height(y.left), height(y.right));
        return y;
    }

    public void insert(K key, V value) {
        root = insert(root, key, value);
    }

    private Node insert(Node node, K key, V value) {
        if (node == null) return new Node(key, value);
        int cmp = key.compareTo(node.key);
        if (cmp < 0) node.left = insert(node.left, key, value);
        else if (cmp > 0) node.right = insert(node.right, key, value);
        else {
            node.value = value; // update
            return node;
        }

        node.height = 1 + Math.max(height(node.left), height(node.right));
        int balance = balance(node);

        // Left Left
        if (balance > 1 && key.compareTo(node.left.key) < 0)
            return rotateRight(node);
        // Right Right
        if (balance < -1 && key.compareTo(node.right.key) > 0)
            return rotateLeft(node);
        // Left Right
        if (balance > 1 && key.compareTo(node.left.key) > 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        // Right Left
        if (balance < -1 && key.compareTo(node.right.key) < 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }

    public V search(K key) {
        return search(root, key);
    }

    private V search(Node node, K key) {
        if (node == null) return null;
        int cmp = key.compareTo(node.key);
        if (cmp < 0) return search(node.left, key);
        else if (cmp > 0) return search(node.right, key);
        else return node.value;
    }

    public void delete(K key) {
        root = delete(root, key);
    }

    private Node delete(Node node, K key) {
        if (node == null) return null;
        int cmp = key.compareTo(node.key);
        if (cmp < 0) node.left = delete(node.left, key);
        else if (cmp > 0) node.right = delete(node.right, key);
        else {
            if (node.left == null) return node.right;
            else if (node.right == null) return node.left;
            else {
                Node min = findMin(node.right);
                node.key = min.key;
                node.value = min.value;
                node.right = delete(node.right, min.key);
            }
        }
        node.height = 1 + Math.max(height(node.left), height(node.right));
        int balance = balance(node);
        // rebalance same as insert (simplified)
        if (balance > 1 && balance(node.left) >= 0)
            return rotateRight(node);
        if (balance > 1 && balance(node.left) < 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        if (balance < -1 && balance(node.right) <= 0)
            return rotateLeft(node);
        if (balance < -1 && balance(node.right) > 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }

    private Node findMin(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }
}