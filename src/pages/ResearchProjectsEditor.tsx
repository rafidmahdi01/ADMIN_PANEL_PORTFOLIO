import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { ResearchProject } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface ResearchProjectsEditorProps {
  onLogout: () => void;
}

export default function ResearchProjectsEditor({ onLogout }: ResearchProjectsEditorProps) {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ResearchProject | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<ResearchProject>('research-projects');
      console.log('📊 Loaded research projects:', result.data.length, 'records');
      console.log('📋 Records:', result.data);
      setProjects(result.data);
      setSha(result.sha);
      setOriginalContent(result.originalContent);
      setError('');
    } catch (err) {
      setError('Failed to load research projects. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newProject: ResearchProject = {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      status: 'ongoing',
    };
    setEditForm(newProject);
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...projects[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this research project?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = projects.filter((_, i) => i !== index);
      await githubService.updateData(
        'research-projects',
        updated,
        'ResearchProject',
        'researchProjects',
        `Deleted research project: ${projects[index].title}`,
        sha,
        originalContent
      );
      await loadProjects();
    } catch (err) {
      setError('Failed to delete research project');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.title || !editForm.description || !editForm.startDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: ResearchProject[];
      let message: string;

      if (editingIndex === -1) {
        updated = [...projects, editForm];
        message = `Added research project: ${editForm.title}`;
      } else if (editingIndex !== null) {
        updated = [...projects];
        updated[editingIndex] = editForm;
        message = `Updated research project: ${editForm.title}`;
      } else {
        return;
      }

      // Safety check: Confirm before saving
      const confirmMsg = editingIndex === -1 
        ? `Add new research project?\n\nCurrent: ${projects.length} records\nAfter save: ${updated.length} records\n\nNew: ${editForm.title}`
        : `Update research project?\n\nTitle: ${editForm.title}\nTotal records: ${updated.length}`;
      
      if (!confirm(confirmMsg)) {
        setSaving(false);
        return;
      }

      console.log('💾 Saving research projects...');
      console.log('📊 Current records:', projects.length);
      console.log('📊 Updated records:', updated.length);
      console.log('📋 Updated data:', updated);

      await githubService.updateData(
        'research-projects',
        updated,
        'ResearchProject',
        'researchProjects',
        message,
        sha,
        originalContent
      );

      console.log('✅ Save successful! Reloading data...');
      await loadProjects();
      setEditForm(null);
      setEditingIndex(null);
      alert('✅ Saved successfully!');
    } catch (err) {
      setError('Failed to save research project');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(null);
    setEditingIndex(null);
    setError('');
  };

  if (loading) {
    return (
      <EditorLayout
        title="Research Projects"
        description="Manage ongoing and completed research projects"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading research projects...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Research Projects"
      description="Manage ongoing and completed research projects"
      onLogout={onLogout}
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleAdd}
          disabled={editingIndex !== null || saving}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      {editForm !== null && (
        <div className="card mb-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Project' : 'Edit Project'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="input"
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="input"
                rows={4}
                placeholder="Project description and objectives"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={editForm.endDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ResearchProject['status'] })}
                className="input"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Agency
              </label>
              <input
                type="text"
                value={editForm.fundingAgency || ''}
                onChange={(e) => setEditForm({ ...editForm, fundingAgency: e.target.value })}
                className="input"
                placeholder="Name of funding organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="input"
                placeholder="$100,000"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Project'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No research projects yet. Click "Add New Project" to get started.</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{project.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{project.startDate}</span>
                    {project.endDate && <span> - {project.endDate}</span>}
                  </div>
                  {project.fundingAgency && (
                    <p className="text-sm text-gray-600 mt-1">
                      Funding: {project.fundingAgency}
                      {project.amount && ` • ${project.amount}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(index)}
                    disabled={editingIndex !== null || saving}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    disabled={editingIndex !== null || saving}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </EditorLayout>
  );
}
