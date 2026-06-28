import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Workflows from './pages/Workflows';
import WorkflowDetail from './pages/WorkflowDetail';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import UndoHistory from './pages/UndoHistory';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/workflows" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Workflows />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/workflows/:id" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <WorkflowDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Resources />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Templates />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/undo" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <UndoHistory />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;