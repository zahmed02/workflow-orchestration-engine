import React, { useEffect, useState } from 'react';
import { getResources, createResource, updateResource, deleteResource } from '../services/api';
import ResourceTable from '../components/resources/ResourceTable';
import ResourceFormModal from '../components/resources/ResourceFormModal';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await getResources();
      setResources(res.data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = () => {
    setEditingResource(null);
    setModalOpen(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await deleteResource(id);
        fetchResources();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleModalSave = async (resourceData) => {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, resourceData);
      } else {
        await createResource(resourceData);
      }
      setModalOpen(false);
      fetchResources();
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  // Compute summary stats
  const totalNodes = resources.length;
  const totalCapacity = resources.reduce((sum, r) => sum + r.total, 0);
  const totalAvailable = resources.reduce((sum, r) => sum + r.available, 0);
  const avgUtilization = totalCapacity > 0 ? ((totalCapacity - totalAvailable) / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Resources</h2>
          <p className="text-on-surface-variant">Monitor and manage your infrastructure nodes and compute capacity.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-on-primary-container rounded-lg flex items-center gap-2 hover:brightness-110 transition"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Resource
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Total Nodes</span>
            <span className="material-symbols-outlined text-primary">dns</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{totalNodes}</span>
            <span className="text-secondary text-sm ml-2">+{Math.floor(Math.random() * 5)} this week</span>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Avg Utilization</span>
            <span className="material-symbols-outlined text-tertiary">analytics</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{avgUtilization.toFixed(1)}%</span>
            <span className="text-secondary text-sm ml-2">Stable</span>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Active Jobs</span>
            <span className="material-symbols-outlined text-secondary">memory</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{Math.floor(Math.random() * 500) + 500}</span>
            <span className="text-on-surface-variant text-sm ml-2">across clusters</span>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Uptime</span>
            <span className="material-symbols-outlined text-primary">timer</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">99.98%</span>
            <span className="text-secondary text-sm ml-2">LTM</span>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <ResourceTable
          resources={resources}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Modal */}
      <ResourceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initialData={editingResource}
      />
    </div>
  );
};

export default Resources;