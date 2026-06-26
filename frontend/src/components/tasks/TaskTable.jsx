import React from 'react';

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    READY: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    RUNNING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const level = priority >= 8 ? 'High' : priority >= 5 ? 'Medium' : 'Low';
  const color = priority >= 8 ? 'text-error' : priority >= 5 ? 'text-tertiary' : 'text-secondary';
  return <span className={`font-semibold ${color}`}>{level}</span>;
};

const TaskTable = ({ tasks, onEdit, onDelete, onUndo }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
        No tasks found. Create your first task!
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-lowest border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">ID</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant text-center">Priority</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant text-center">Deps</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Created At</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-surface-bright transition-colors group">
                <td className="px-4 py-3 font-mono text-sm text-primary">#{task.id}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-on-surface">{task.name}</span>
                    {task.dependencies && task.dependencies.length > 0 && (
                      <span className="text-[10px] text-on-surface-variant">
                        Depends on: {task.dependencies.map(d => d.name).join(', ')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3 text-center text-on-surface-variant">
                  {task.dependencies ? task.dependencies.length : 0}
                </td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">
                  {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onUndo(task.id)}
                      className="p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-secondary"
                      title="Undo"
                    >
                      <span className="material-symbols-outlined text-sm">undo</span>
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;