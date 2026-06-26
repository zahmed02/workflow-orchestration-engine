import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-background flex">
      <Sidebar />
      <div className="flex-1 ml-sidebar-width flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;