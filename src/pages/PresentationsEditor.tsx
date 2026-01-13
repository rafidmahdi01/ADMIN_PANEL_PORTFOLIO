import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { Presentation } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface PresentationsEditorProps {
  onLogout: () => void;
}

export default function PresentationsEditor({ onLogout }: PresentationsEditorProps) {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Presentation | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<Presentation>('presentations');
      console.log('📊 Loaded presentations:', result.data.length, 'records');
      console.log('📋 Records:', result.data);
      setPresentations(result.data);
      setSha(result.sha);
      setError('');
    } catch (err) {
      setError('Failed to load presentations. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newPresentation: Presentation = {
      title: '',
      event: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      type: 'contributed',
    };
    setEditForm(newPresentation);
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...presentations[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this presentation?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = presentations.filter((_, i) => i !== index);
      await githubService.updateData(
        'presentations',
        updated,
        'Presentation',
        'presentations',
        `Deleted presentation: ${presentations[index].title}`,
        sha
      );
      await loadPresentations();
    } catch (err) {
      setError('Failed to delete presentation');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.title || !editForm.event || !editForm.location || !editForm.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: Presentation[];
      let message: string;

      if (editingIndex === -1) {
        updated = [...presentations, editForm];
        message = `Added presentation: ${editForm.title}`;
      } else if (editingIndex !== null) {
        updated = [...presentations];
        updated[editingIndex] = editForm;
        message = `Updated presentation: ${editForm.title}`;
      } else {
        return;
      }

      // Safety check: Confirm before saving
      const confirmMsg = editingIndex === -1 
        ? `Add new presentation?\n\nCurrent: ${presentations.length} records\nAfter save: ${updated.length} records\n\nNew: ${editForm.title}`
        : `Update presentation?\n\nTitle: ${editForm.title}\nTotal records: ${updated.length}`;
      
      if (!confirm(confirmMsg)) {
        setSaving(false);
        return;
      }

      console.log('💾 Saving presentations...');
      console.log('📊 Current records:', presentations.length);
      console.log('📊 Updated records:', updated.length);
      console.log('📋 Updated data:', updated);

      await githubService.updateData(
        'presentations',
        updated,
        'Presentation',
        'presentations',
        message,
        sha
      );

      console.log('✅ Save successful! Reloading data...');
      await loadPresentations();
      setEditForm(null);
      setEditingIndex(null);
      alert('✅ Saved successfully!');
    } catch (err) {
      setError('Failed to save presentation');
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
        title="Presentations"
        description="Manage keynotes, invited talks, and conference presentations"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading presentations...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Presentations"
      description="Manage keynotes, invited talks, and conference presentations"
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
          Add New Presentation
        </button>
      </div>

      {editForm !== null && (
        <div className="card mb-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Presentation' : 'Edit Presentation'}
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
                placeholder="Presentation title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.event}
                onChange={(e) => setEditForm({ ...editForm, event: e.target.value })}
                className="input"
                placeholder="Conference or event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="input"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Presentation['type'] })}
                className="input"
              >
                <option value="keynote">Keynote</option>
                <option value="invited">Invited Talk</option>
                <option value="contributed">Contributed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slides URL
              </label>
              <input
                type="url"
                value={editForm.slidesUrl || ''}
                onChange={(e) => setEditForm({ ...editForm, slidesUrl: e.target.value })}
                className="input"
                placeholder="https://example.com/slides.pdf"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Presentation'}
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
        {presentations.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No presentations yet. Click "Add New Presentation" to get started.</p>
          </div>
        ) : (
          presentations.map((presentation, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{presentation.title}</h3>
                  <p className="text-gray-600 mt-1">{presentation.event}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {presentation.location} • {presentation.date}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                    {presentation.type}
                  </span>
                  {presentation.slidesUrl && (
                    <a
                      href={presentation.slidesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block ml-2"
                    >
                      View Slides →
                    </a>
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
