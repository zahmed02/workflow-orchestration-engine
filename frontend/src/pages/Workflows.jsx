import React, { useEffect, useState } from 'react';
import { getWorkflows, getTasks, createWorkflow, deleteWorkflow, executeWorkflow } from '../services/api';
import WorkflowCard from '../components/workflows/WorkflowCard';
import WorkflowFormModal from '../components/workflows/WorkflowFormModal';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wfRes, tasksRes] = await Promise.all([getWorkflows(), getTasks()]);
      setWorkflows(wfRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to fetch workflows', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workflow?')) {
      try {
        await deleteWorkflow(id);
        fetchData();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleExecute = async (id) => {
    try {
      await executeWorkflow(id);
      // Optionally refresh after a delay to see updated statuses
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Execution failed', error);
    }
  };

  const handleModalSave = async (data) => {
    try {
      await createWorkflow(data);
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Workflow creation failed', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading workflows...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Workflows</h2>
          <p className="text-on-surface-variant">Manage and monitor your automated pipelines</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-on-primary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
          No workflows yet. Create your first workflow!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onDelete={handleDelete}
              onExecute={handleExecute}
            />
          ))}
        </div>
      )}

      <WorkflowFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        availableTasks={tasks}
      />
    </div>
  );
};

export default Workflows;