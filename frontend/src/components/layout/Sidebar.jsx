import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  FolderIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Workflows', href: '/workflows', icon: BoltIcon },
  { name: 'Resources', href: '/resources', icon: FolderIcon },
  { name: 'Templates', href: '/templates', icon: DocumentTextIcon },
  { name: 'Undo History', href: '/undo', icon: ClockIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container-low border-r border-outline-variant flex flex-col py-4 z-50">
      <div className="px-4 mb-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
          <span className="text-on-primary-fixed font-bold text-xl">F</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">FlowState</h1>
          <p className="text-[10px] uppercase tracking-widest text-outline">Workflow Engine</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-surface-container text-primary border-l-4 border-primary pl-3'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={() => navigate('/tasks')}
          className="w-full py-2 bg-primary text-on-primary-container font-semibold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create New
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;