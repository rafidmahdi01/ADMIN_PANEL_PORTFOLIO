import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { Supervision } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface SupervisionEditorProps {
  onLogout: () => void;
}

export default function SupervisionEditor({ onLogout }: SupervisionEditorProps) {
  const [supervisions, setSupervisions] = useState<Supervision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Supervision | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSupervisions();
  }, []);

  const loadSupervisions = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<Supervision>('supervision');
      setSupervisions(result.data);
      setSha(result.sha);
      setError('');
    } catch (err) {
      setError('Failed to load supervision records. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newSupervision: Supervision = {
      studentName: '',
      level: 'masters',
      topic: '',
      year: new Date().getFullYear().toString(),
      status: 'ongoing',
    };
    setEditForm(newSupervision);
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...supervisions[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this supervision record?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = supervisions.filter((_, i) => i !== index);
      await githubService.updateData(
        'supervision',
        updated,
        'Supervision',
        'supervision',
        `Deleted supervision: ${supervisions[index].studentName}`,
        sha
      );
      await loadSupervisions();
    } catch (err) {
      setError('Failed to delete supervision record');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.studentName || !editForm.topic || !editForm.year) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: Supervision[];
      let message: string;

      if (editingIndex === -1) {
        updated = [...supervisions, editForm];
        message = `Added supervision: ${editForm.studentName}`;
      } else if (editingIndex !== null) {
        updated = [...supervisions];
        updated[editingIndex] = editForm;
        message = `Updated supervision: ${editForm.studentName}`;
      } else {
        return;
      }

      await githubService.updateData(
        'supervision',
        updated,
        'Supervision',
        'supervision',
        message,
        sha
      );

      await loadSupervisions();
      setEditForm(null);
      setEditingIndex(null);
    } catch (err) {
      setError('Failed to save supervision record');
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
        title="Student Supervision"
        description="Manage PhD, Masters, and undergraduate student records"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading supervision records...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Student Supervision"
      description="Manage PhD, Masters, and undergraduate student records"
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
          Add New Student
        </button>
      </div>

      {editForm !== null && (
        <div className="card mb-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Student' : 'Edit Student'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.studentName}
                onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                className="input"
                placeholder="Full name of student"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.level}
                onChange={(e) => setEditForm({ ...editForm, level: e.target.value as Supervision['level'] })}
                className="input"
              >
                <option value="phd">PhD</option>
                <option value="masters">Masters</option>
                <option value="undergraduate">Undergraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Research Topic <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editForm.topic}
                onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                className="input"
                rows={3}
                placeholder="Thesis or research topic"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                className="input"
                placeholder="2024 or 2022-2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Supervision['status'] })}
                className="input"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Student'}
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
        {supervisions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No supervision records yet. Click "Add New Student" to get started.</p>
          </div>
        ) : (
          supervisions.map((supervision, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{supervision.studentName}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                      {supervision.level.toUpperCase()}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      supervision.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {supervision.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{supervision.topic}</p>
                  <p className="text-sm text-gray-500 mt-1">{supervision.year}</p>
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
