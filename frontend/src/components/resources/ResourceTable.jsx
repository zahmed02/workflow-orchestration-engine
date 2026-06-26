import React from 'react';

const ResourceTable = ({ resources, onEdit, onDelete }) => {
  if (resources.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
        No resources found. Add your first resource!
      </div>
    );
  }

  const getUsageColor = (usage) => {
    if (usage < 70) return 'bg-secondary';
    if (usage < 90) return 'bg-tertiary';
    return 'bg-error';
  };

  const getLabelColor = (usage) => {
    if (usage < 70) return 'text-secondary';
    if (usage < 90) return 'text-tertiary';
    return 'text-error';
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-lowest border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Resource Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Total Capacity</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Available</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant">Usage %</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {resources.map((resource) => {
              const usage = resource.total > 0 ? ((resource.total - resource.available) / resource.total * 100) : 0;
              const displayTotal = resource.total >= 1 ? resource.total : resource.total.toFixed(2);
              const displayAvailable = resource.available >= 1 ? resource.available : resource.available.toFixed(2);
              return (
                <tr key={resource.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getUsageColor(usage)}`}></div>
                      <span className="text-sm font-semibold text-on-surface">{resource.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{displayTotal}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{displayAvailable}</td>
                  <td className="px-4 py-3 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getUsageColor(usage)} transition-all duration-500`}
                          style={{ width: `${Math.min(usage, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-semibold ${getLabelColor(usage)}`}>
                        {Math.round(usage)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(resource)}
                        className="p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(resource.id)}
                        className="p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-error"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;