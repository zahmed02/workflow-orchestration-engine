import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TopBar = ({ onLogout }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-6 flex justify-between items-center bg-background border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search tasks, workflows, resources..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-on-surface-variant">Welcome, {username}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-error-container/20 text-error rounded-lg hover:bg-error-container/30 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;