import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkflow, executeWorkflow, deleteWorkflow, saveTemplate } from '../services/api';

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const fetchWorkflow = async () => {
    setLoading(true);
    try {
      const res = await getWorkflow(id);
      setWorkflow(res.data);
    } catch (error) {
      console.error('Failed to fetch workflow', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const handleExecute = async () => {
    setExecuting(true);
    try {
      await executeWorkflow(id);
      setTimeout(fetchWorkflow, 2000);
    } catch (error) {
      console.error('Execution failed', error);
    } finally {
      setExecuting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this workflow?')) {
      try {
        await deleteWorkflow(id);
        navigate('/workflows');
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  // ✅ SAVE TEMPLATE
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    try {
      await saveTemplate(templateName, workflow);
      alert(`✅ Template "${templateName}" saved successfully!`);
      setShowTemplateModal(false);
      setTemplateName('');
    } catch (error) {
      console.error('Failed to save template', error);
      alert('Failed to save template. Check console for details.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading workflow details...</div>;
  }

  if (!workflow) {
    return <div className="text-center py-10 text-on-surface-variant">Workflow not found</div>;
  }

  const { tasks = [] } = workflow;
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const running = tasks.filter(t => t.status === 'RUNNING').length;
  const failed = tasks.filter(t => t.status === 'FAILED').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/workflows')}
            className="text-on-surface-variant hover:text-primary flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Workflows
          </button>
          <h2 className="text-2xl font-bold text-on-surface">{workflow.name}</h2>
          <p className="text-on-surface-variant">
            {totalTasks} tasks • {completed} completed • {running} running • {pending} pending • {failed} failed
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* ✅ SAVE AS TEMPLATE BUTTON */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition"
          >
            <span className="material-symbols-outlined">save</span>
            Save as Template
          </button>
          <button
            onClick={handleExecute}
            disabled={executing || totalTasks === 0}
            className="px-4 py-2 bg-primary text-on-primary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {executing ? 'hourglass_top' : 'play_arrow'}
            </span>
            {executing ? 'Executing...' : 'Execute'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-error-container/20 text-error rounded-lg hover:bg-error-container/30 transition"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      {/* Task Table (unchanged) */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
        {totalTasks === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            This workflow has no tasks.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-lowest border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Task ID</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant text-center">Priority</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Dependencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {tasks.map((task) => {
                  const depNames = task.dependencies?.map(d => d.name).join(', ') || 'None';
                  return (
                    <tr key={task.id} className="hover:bg-surface-bright transition-colors">
                      <td className="px-4 py-3 font-mono text-sm text-primary">#{task.id}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-on-surface">{task.name}</td>
                      <td className="px-4 py-3 text-center text-sm text-on-surface-variant">{task.priority}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold border
                          ${task.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            task.status === 'RUNNING' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            task.status === 'FAILED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            task.status === 'READY' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{depNames}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Template Save Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-on-surface">Save as Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              This will save the current workflow configuration as a template in the AVL Tree cache.
            </p>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name (e.g., Data Pipeline Template)"
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-surface-bright text-on-surface-variant rounded-lg hover:bg-surface-container-highest"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-primary text-on-primary-container rounded-lg hover:brightness-110 transition"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowDetail;