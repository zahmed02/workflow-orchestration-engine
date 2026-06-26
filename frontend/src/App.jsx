import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Workflows from './pages/Workflows';
import WorkflowDetail from './pages/WorkflowDetail';   // <-- new import
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import UndoHistory from './pages/UndoHistory';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflows/:id" element={<WorkflowDetail />} />   {/* new route */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/undo" element={<UndoHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;