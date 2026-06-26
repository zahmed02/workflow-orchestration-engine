import React, { useState, useEffect } from 'react';

const ResourceFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    total: 0,
    available: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        total: initialData.total || 0,
        available: initialData.available || 0,
      });
    } else {
      setFormData({ name: '', total: 0, available: 0 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'name' ? value : parseFloat(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-on-surface">
            {initialData ? 'Edit Resource' : 'Add Resource'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Total Capacity</label>
            <input
              type="number"
              name="total"
              step="0.01"
              min="0"
              value={formData.total}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Available</label>
            <input
              type="number"
              name="available"
              step="0.01"
              min="0"
              value={formData.available}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-bright text-on-surface-variant rounded-lg hover:bg-surface-container-highest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary-container rounded-lg hover:brightness-110 transition"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;