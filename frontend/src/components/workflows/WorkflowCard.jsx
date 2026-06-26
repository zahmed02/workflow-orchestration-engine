import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkflowCard = ({ workflow, onDelete, onExecute }) => {
  const navigate = useNavigate();

  const totalTasks = workflow.tasks ? workflow.tasks.length : 0;
  const completed = workflow.tasks ? workflow.tasks.filter(t => t.status === 'COMPLETED').length : 0;
  const status = completed === totalTasks && totalTasks > 0 ? 'Completed' : totalTasks > 0 ? 'Running' : 'Empty';
  const statusColor = status === 'Completed' ? 'text-secondary border-secondary' : status === 'Running' ? 'text-primary border-primary' : 'text-on-surface-variant border-outline-variant';

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 hover:border-primary transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">account_tree</span>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${statusColor}`}>
          {status}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-on-surface">{workflow.name}</h4>
      <p className="text-sm text-on-surface-variant mb-4">{totalTasks} tasks</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Tasks</span>
          <span className="text-on-surface font-semibold">{totalTasks}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Completed</span>
          <span className="text-on-surface font-semibold">{completed}</span>
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-outline-variant flex gap-2">
        <button
          onClick={() => navigate(`/workflows/${workflow.id}`)}
          className="flex-1 py-2 bg-surface-bright hover:bg-primary hover:text-on-primary-container rounded font-semibold transition flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">visibility</span> View
        </button>
        <button
          onClick={() => onExecute(workflow.id)}
          className="p-2 bg-surface-bright hover:text-secondary rounded transition-colors"
          title="Execute"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </button>
        <button
          onClick={() => onDelete(workflow.id)}
          className="p-2 bg-surface-bright hover:text-error rounded transition-colors"
          title="Delete"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;