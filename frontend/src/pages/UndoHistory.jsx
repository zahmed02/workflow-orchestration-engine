import React, { useEffect, useState } from 'react';
import { getUndoHistory } from '../services/api';

const UndoHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getUndoHistory();
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch undo history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Refresh every 5 seconds to show live updates
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading undo history...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Undo History</h2>
        <p className="text-on-surface-variant">Stack of saved task states (most recent at top)</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
          No undo history available. Execute workflows to save task states.
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
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
                {/* Show in reverse order (most recent first) */}
                {[...history].reverse().map((task, idx) => {
                  const depNames = task.dependencies?.map(d => d.name).join(', ') || 'None';
                  return (
                    <tr key={idx} className="hover:bg-surface-bright transition-colors">
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
        </div>
      )}
    </div>
  );
};

export default UndoHistory;