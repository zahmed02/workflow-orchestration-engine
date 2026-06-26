import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getWorkflows, getResources } from '../services/api';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentExecutions from '../components/dashboard/RecentExecutions';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, workflowsRes, resourcesRes] = await Promise.all([
          getTasks(),
          getWorkflows(),
          getResources(),
        ]);
        setTasks(tasksRes.data);
        setWorkflows(workflowsRes.data);
        setResources(resourcesRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-on-surface">Loading dashboard...</div>;
  }

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const runningTasks = tasks.filter(t => t.status === 'RUNNING').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const failedTasks = tasks.filter(t => t.status === 'FAILED').length;

  const totalWorkflows = workflows.length;

  const cpuResource = resources.find(r => r.name === 'CPU');
  const memoryResource = resources.find(r => r.name === 'Memory');
  const cpuUsage = cpuResource ? ((cpuResource.total - cpuResource.available) / cpuResource.total * 100) : 0;
  const memoryUsage = memoryResource ? ((memoryResource.total - memoryResource.available) / memoryResource.total * 100) : 0;

  const quickActions = [
    { label: 'Create Task', icon: 'add_task', path: '/tasks' },
    { label: 'Create Workflow', icon: 'schema', path: '/workflows' },
    { label: 'Import Template', icon: 'description', path: '/templates' },
    { label: 'Deploy Script', icon: 'cloud_upload', path: '/workflows' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">System Overview</h2>
          <p className="text-on-surface-variant">Real-time status of your automated workflows and task clusters.</p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 bg-primary text-on-primary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition"
        >
          <span className="material-symbols-outlined">add</span>
          Create New
        </button>
      </div>

      <SummaryCards
        totalTasks={totalTasks}
        pending={pendingTasks}
        running={runningTasks}
        completed={completedTasks}
        failed={failedTasks}
        totalWorkflows={totalWorkflows}
        cpuUsage={cpuUsage}
        memoryUsage={memoryUsage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentExecutions workflows={workflows} tasks={tasks} />
        </div>
        <div>
          <ActivityFeed tasks={tasks} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col items-center gap-2 hover:scale-105 transition-transform hover:border-primary"
            >
              <span className="material-symbols-outlined text-primary">{action.icon}</span>
              <span className="text-sm font-medium text-on-surface">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;