import React, { useState } from 'react';

const WorkflowFormModal = ({ isOpen, onClose, onSave, availableTasks }) => {
  const [name, setName] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  if (!isOpen) return null;

  const handleToggleTask = (taskId) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, taskIds: selectedTaskIds });
    setName('');
    setSelectedTaskIds([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-on-surface">Create Workflow</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Workflow Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
              placeholder="e.g., Data Sync Pipeline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Select Tasks</label>
            <div className="max-h-40 overflow-y-auto bg-surface-container border border-outline-variant rounded-lg p-2">
              {availableTasks.length === 0 ? (
                <div className="text-sm text-on-surface-variant">No tasks available. Create tasks first.</div>
              ) : (
                availableTasks.map(task => (
                  <label key={task.id} className="flex items-center gap-2 py-1 hover:bg-surface-bright px-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleToggleTask(task.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-on-surface">{task.name}</span>
                    <span className="text-xs text-on-surface-variant ml-auto">Priority: {task.priority}</span>
                  </label>
                ))
              )}
            </div>
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
              disabled={!name.trim()}
              className="px-4 py-2 bg-primary text-on-primary-container rounded-lg hover:brightness-110 transition disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowFormModal;