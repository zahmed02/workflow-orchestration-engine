import React, { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  undoTask,
} from '../services/api';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskTable from '../components/tasks/TaskTable';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      const res = await getTasks(params);
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, searchTerm]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleUndo = async (id) => {
    try {
      await undoTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Undo failed', error);
    }
  };

  const handleModalSave = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      setModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Tasks</h2>
          <p className="text-on-surface-variant">Manage your task definitions</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-on-primary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition"
        >
          <span className="material-symbols-outlined">add_task</span>
          Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="READY">Ready</option>
          <option value="RUNNING">Running</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 w-48 focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={fetchTasks}
          className="p-2 bg-surface-bright text-on-surface-variant rounded-lg border border-outline-variant hover:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      {/* Task Table */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUndo={handleUndo}
        />
      )}

      {/* Create/Edit Modal */}
      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initialData={editingTask}
      />
    </div>
  );
};

export default Tasks;