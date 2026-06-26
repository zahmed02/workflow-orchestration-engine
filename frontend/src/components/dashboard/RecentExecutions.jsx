import React, { useEffect, useState } from 'react';
import { getRecentLogs } from '../../services/api';

const RecentExecutions = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getRecentLogs();
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-on-surface-variant">Loading executions...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant">
        No executions yet. Run a workflow to see logs.
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
      <div className="p-4 border-b border-outline-variant flex justify-between items-center">
        <h4 className="text-lg font-semibold text-on-surface">Recent Executions</h4>
        <button className="text-primary text-xs font-semibold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-2 text-xs font-bold uppercase text-on-surface-variant">Task</th>
              <th className="px-4 py-2 text-xs font-bold uppercase text-on-surface-variant">Status</th>
              <th className="px-4 py-2 text-xs font-bold uppercase text-on-surface-variant">Start</th>
              <th className="px-4 py-2 text-xs font-bold uppercase text-on-surface-variant">End</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-surface-bright transition-colors">
                <td className="px-4 py-3 text-sm text-on-surface">{log.task.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border
                    ${log.result === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      log.result === 'FAILED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}
                  >
                    {log.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">
                  {log.startTime ? new Date(log.startTime).toLocaleTimeString() : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">
                  {log.endTime ? new Date(log.endTime).toLocaleTimeString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExecutions;