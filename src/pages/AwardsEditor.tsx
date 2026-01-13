import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { Award } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface AwardsEditorProps {
  onLogout: () => void;
}

export default function AwardsEditor({ onLogout }: AwardsEditorProps) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Award | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<Award>('awards');
      console.log('📊 Loaded awards:', result.data.length, 'records');
      console.log('📋 Records:', result.data);
      setAwards(result.data);
      setSha(result.sha);
      setError('');
    } catch (err) {
      setError('Failed to load awards. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newAward: Award = {
      title: '',
      organization: '',
      institution: '',
      date: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear().toString(),
      category: 'awards',
      type: '',
    };
    setEditForm(newAward);
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...awards[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this award?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = awards.filter((_, i) => i !== index);
      await githubService.updateData(
        'awards',
        updated,
        'Award',
        'awards',
        `Deleted award: ${awards[index].title}`,
        sha
      );
      await loadAwards();
    } catch (err) {
      setError('Failed to delete award');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.title || !editForm.organization || !editForm.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: Award[];
      let message: string;

      if (editingIndex === -1) {
        updated = [...awards, editForm];
        message = `Added award: ${editForm.title}`;
      } else if (editingIndex !== null) {
        updated = [...awards];
        updated[editingIndex] = editForm;
        message = `Updated award: ${editForm.title}`;
      } else {
        return;
      }

      // Safety check: Confirm before saving
      const confirmMsg = editingIndex === -1 
        ? `Add new award?\n\nCurrent: ${awards.length} records\nAfter save: ${updated.length} records\n\nNew: ${editForm.title}`
        : `Update award?\n\nTitle: ${editForm.title}\nTotal records: ${updated.length}`;
      
      if (!confirm(confirmMsg)) {
        setSaving(false);
        return;
      }

      console.log('💾 Saving awards...');
      console.log('📊 Current records:', awards.length);
      console.log('📊 Updated records:', updated.length);
      console.log('📋 Updated data:', updated);

      await githubService.updateData(
        'awards',
        updated,
        'Award',
        'awards',
        message,
        sha
      );

      console.log('✅ Save successful! Reloading data...');
      await loadAwards();
      setEditForm(null);
      setEditingIndex(null);
      alert('✅ Saved successfully!');
    } catch (err) {
      setError('Failed to save award');
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
        title="Awards & Honors"
        description="Manage awards, recognitions, and certificates"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading awards...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Awards & Honors"
      description="Manage awards, recognitions, and certificates"
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
          Add New Award
        </button>
      </div>

      {editForm !== null && (
        <div className="card mb-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Award' : 'Edit Award'}
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
                placeholder="Best Paper Award"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.organization}
                onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                className="input"
                placeholder="IEEE Computer Society"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution <span className="text-gray-500 text-xs">(Organization name for display)</span>
              </label>
              <input
                type="text"
                value={editForm.institution || ''}
                onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                className="input"
                placeholder="Research Chef Association United States"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Year <span className="text-gray-500 text-xs">(For display)</span>
                </label>
                <input
                  type="text"
                  value={editForm.year || ''}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  className="input"
                  placeholder="2023"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category || 'awards'}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Award['category'] })}
                  className="input"
                >
                  <option value="awards">🏆 Awards</option>
                  <option value="services">🤝 Services</option>
                  <option value="honors">⭐ Honors</option>
                  <option value="fellowships">🎓 Fellowships</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-gray-500 text-xs">(Specific role or category)</span>
                </label>
                <input
                  type="text"
                  value={editForm.type || ''}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="input"
                  placeholder="Editorial Board Member Of Prestigious Journals"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Additional details about the award"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate URL
              </label>
              <input
                type="url"
                value={editForm.certificateUrl || ''}
                onChange={(e) => setEditForm({ ...editForm, certificateUrl: e.target.value })}
                className="input"
                placeholder="https://example.com/certificate.pdf"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Award'}
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
        {awards.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No awards yet. Click "Add New Award" to get started.</p>
          </div>
        ) : (
          awards.map((award, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                  <p className="text-gray-600 mt-1">{award.organization}</p>
                  <p className="text-sm text-gray-500 mt-1">{award.date}</p>
                  {award.description && (
                    <p className="text-gray-600 mt-2">{award.description}</p>
                  )}
                  {award.certificateUrl && (
                    <a
                      href={award.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block"
                    >
                      View Certificate →
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
