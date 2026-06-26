import React, { useEffect, useState } from 'react';
import { getRecentLogs } from '../../services/api';

const ActivityFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getRecentLogs();
        setLogs(res.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch activity', error);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (logs.length === 0) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center text-on-surface-variant">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col h-full">
      <h4 className="text-lg font-semibold text-on-surface mb-4">Activity Feed</h4>
      <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
        {logs.map(log => {
          const icon = log.result === 'COMPLETED' ? 'check' : log.result === 'FAILED' ? 'priority_high' : 'play_arrow';
          const color = log.result === 'COMPLETED' ? 'secondary' : log.result === 'FAILED' ? 'error' : 'primary';
          const timeAgo = log.startTime ? `${Math.floor((Date.now() - new Date(log.startTime).getTime()) / 60000)}m ago` : 'now';
          return (
            <div key={log.id} className="relative pl-6 flex flex-col gap-0.5">
              <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border 
                ${color === 'secondary' ? 'bg-secondary-container/20 border-secondary/40' :
                  color === 'error' ? 'bg-error-container/20 border-error/40' :
                  'bg-primary-container/20 border-primary/40'}`}
              >
                <span className={`material-symbols-outlined text-sm 
                  ${color === 'secondary' ? 'text-secondary' :
                    color === 'error' ? 'text-error' :
                    'text-primary'}`}
                >
                  {icon}
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Task <span className="font-bold">{log.task.name}</span> {log.result.toLowerCase()}
              </p>
              <div className="flex items-center gap-1 opacity-60">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span className="text-[10px] font-medium">{timeAgo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;