import React, { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../services/api';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch (error) {
      console.error('Failed to fetch templates', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (name) => {
    if (window.confirm(`Delete template "${name}"?`)) {
      try {
        await deleteTemplate(name);
        fetchTemplates();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Templates</h2>
          <p className="text-on-surface-variant">Saved workflow templates stored in AVL Tree</p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
          No templates saved yet. Save a workflow as a template from the workflow detail page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((name) => (
            <div
              key={name}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex justify-between items-center hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <span className="text-sm font-semibold text-on-surface">{name}</span>
              </div>
              <button
                onClick={() => handleDelete(name)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-bright rounded text-on-surface-variant hover:text-error"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;