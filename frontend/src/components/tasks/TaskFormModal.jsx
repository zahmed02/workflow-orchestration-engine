import React, { useState, useEffect } from 'react';
import { getTasks } from '../../services/api';

const TaskFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    priority: 5,
    status: 'PENDING',
    dependencies: [],
  });
  const [allTasks, setAllTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        priority: initialData.priority || 5,
        status: initialData.status || 'PENDING',
        dependencies: initialData.dependencies || [],
      });
    } else {
      setFormData({ name: '', priority: 5, status: 'PENDING', dependencies: [] });
    }
    // Fetch all tasks for dependency selection
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await getTasks();
        setAllTasks(res.data.filter(t => t.id !== initialData?.id)); // exclude self
      } catch (error) {
        console.error('Failed to fetch tasks for dependencies', error);
      } finally {
        setLoadingTasks(false);
      }
    };
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDependencyToggle = (taskId) => {
    setFormData(prev => {
      const deps = prev.dependencies.map(d => d.id);
      if (deps.includes(taskId)) {
        return {
          ...prev,
          dependencies: prev.dependencies.filter(d => d.id !== taskId),
        };
      } else {
        const task = allTasks.find(t => t.id === taskId);
        return {
          ...prev,
          dependencies: [...prev.dependencies, task],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-on-surface">
            {initialData ? 'Edit Task' : 'Create Task'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Priority (1-10)</label>
            <input
              type="number"
              name="priority"
              min="1"
              max="10"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            >
              <option value="PENDING">Pending</option>
              <option value="READY">Ready</option>
              <option value="RUNNING">Running</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Dependencies</label>
            {loadingTasks ? (
              <div className="text-sm text-on-surface-variant">Loading tasks...</div>
            ) : (
              <div className="max-h-40 overflow-y-auto bg-surface-container border border-outline-variant rounded-lg p-2">
                {allTasks.length === 0 ? (
                  <div className="text-sm text-on-surface-variant">No other tasks available</div>
                ) : (
                  allTasks.map(task => (
                    <label key={task.id} className="flex items-center gap-2 py-1 hover:bg-surface-bright px-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.dependencies.some(d => d.id === task.id)}
                        onChange={() => handleDependencyToggle(task.id)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-on-surface">{task.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-bright text-on-surface-variant rounded-lg hover:bg-surface-container-highest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary-container rounded-lg hover:brightness-110 transition"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;