import React from 'react';

const SummaryCards = ({
  totalTasks,
  pending,
  running,
  completed,
  failed,
  totalWorkflows,
  cpuUsage,
  memoryUsage,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Total Tasks */}
      <div className="md:col-span-6 lg:col-span-4 bg-surface-container border border-outline-variant p-5 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-7xl">task_alt</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Tasks</p>
        <h3 className="text-3xl font-bold text-primary mt-1">{totalTasks}</h3>
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-outline-variant">
          <div className="text-center">
            <p className="text-[10px] text-on-surface-variant uppercase">Pending</p>
            <p className="font-bold text-on-surface">{pending}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-secondary uppercase">Running</p>
            <p className="font-bold text-secondary">{running}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-on-surface-variant uppercase">Done</p>
            <p className="font-bold text-on-surface">{completed}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-error uppercase">Failed</p>
            <p className="font-bold text-error">{failed}</p>
          </div>
        </div>
      </div>

      {/* Total Workflows */}
      <div className="md:col-span-6 lg:col-span-4 bg-surface-container border border-outline-variant p-5 rounded-xl flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Workflows</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-on-surface">{totalWorkflows}</h3>
            <span className="bg-secondary-container/20 text-secondary text-[10px] px-2 py-0.5 rounded font-bold">+12% vs LW</span>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-1 h-10">
          <div className="flex-1 bg-primary/20 h-4 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/30 h-6 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/40 h-8 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/20 h-5 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/60 h-10 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/40 h-7 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/80 h-10 rounded-t-sm"></div>
          <div className="flex-1 bg-primary/100 h-9 rounded-t-sm"></div>
        </div>
        <p className="text-on-surface-variant text-[11px] mt-2">Active deployments increased by 8 this week.</p>
      </div>

      {/* Resources Usage */}
      <div className="md:col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant p-5 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Resources</p>
          <span className="material-symbols-outlined text-primary">analytics</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>CPU Usage</span>
            <span className="font-bold">{Math.round(cpuUsage)}%</span>
          </div>
          <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(cpuUsage, 100)}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Memory Usage</span>
            <span className="font-bold">{Math.round(memoryUsage)}%</span>
          </div>
          <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${Math.min(memoryUsage, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;