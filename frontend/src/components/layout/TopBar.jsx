import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TopBar = () => {
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
    </header>
  );
};

export default TopBar;