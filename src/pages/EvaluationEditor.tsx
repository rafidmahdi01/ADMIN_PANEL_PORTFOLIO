import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { Evaluation } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface EvaluationEditorProps {
  onLogout: () => void;
}

export default function EvaluationEditor({ onLogout }: EvaluationEditorProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Evaluation | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<Evaluation>('evaluation');
      console.log('📊 Loaded evaluations:', result.data.length, 'records');
      console.log('📋 Records:', result.data);
      setEvaluations(result.data);
      setSha(result.sha);
      setOriginalContent(result.originalContent);
      setError('');
    } catch (err) {
      setError('Failed to load evaluations. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newEvaluation: Evaluation = {
      position: '',
      organization: '',
      period: '',
      description: '',
    };
    setEditForm(newEvaluation);
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...evaluations[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this evaluation?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = evaluations.filter((_, i) => i !== index);
      await githubService.updateData(
        'evaluation',
        updated,
        'Evaluation',
        'evaluation',
        `Deleted evaluation: ${evaluations[index].position}`,
        sha,
        originalContent
      );
      await loadEvaluations();
    } catch (err) {
      setError('Failed to delete evaluation');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.position || !editForm.organization || !editForm.period || !editForm.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: Evaluation[];
      let message: string;

      if (editingIndex === -1) {
        updated = [...evaluations, editForm];
        message = `Added evaluation: ${editForm.position}`;
      } else if (editingIndex !== null) {
        updated = [...evaluations];
        updated[editingIndex] = editForm;
        message = `Updated evaluation: ${editForm.position}`;
      } else {
        return;
      }

      // Safety check: Confirm before saving
      const confirmMsg = editingIndex === -1 
        ? `Add new evaluation?\n\nCurrent: ${evaluations.length} records\nAfter save: ${updated.length} records\n\nNew: ${editForm.position}`
        : `Update evaluation?\n\nPosition: ${editForm.position}\nTotal records: ${updated.length}`;
      
      if (!confirm(confirmMsg)) {
        setSaving(false);
        return;
      }

      console.log('💾 Saving evaluations...');
      console.log('📊 Current records:', evaluations.length);
      console.log('📊 Updated records:', updated.length);
      console.log('📋 Updated data:', updated);

      await githubService.updateData(
        'evaluation',
        updated,
        'Evaluation',
        'evaluation',
        message,
        sha,
        originalContent
      );

      console.log('✅ Save successful! Reloading data...');
      await loadEvaluations();
      setEditForm(null);
      setEditingIndex(null);
      alert('✅ Saved successfully!');
    } catch (err) {
      setError('Failed to save evaluation');
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
        title="Evaluation & Service"
        description="Manage evaluation activities and academic service"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading evaluations...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Evaluation & Service"
      description="Manage evaluation activities and academic service"
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
          Add New Evaluation
        </button>
      </div>

      {editForm !== null && (
        <div className="card mb-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Evaluation' : 'Edit Evaluation'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.position}
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                className="input"
                placeholder="Journal Reviewer, Conference PC Member, etc."
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
                placeholder="Journal name, Conference name, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.period}
                onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                className="input"
                placeholder="2024 or 2022-2024"
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
                rows={3}
                placeholder="Brief description of the role and responsibilities"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Evaluation'}
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
        {evaluations.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No evaluations yet. Click "Add New Evaluation" to get started.</p>
          </div>
        ) : (
          evaluations.map((evaluation, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{evaluation.position}</h3>
                  <p className="text-gray-600 mt-1">{evaluation.organization}</p>
                  <p className="text-sm text-gray-500 mt-1">{evaluation.period}</p>
                  <p className="text-gray-600 mt-2">{evaluation.description}</p>
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
