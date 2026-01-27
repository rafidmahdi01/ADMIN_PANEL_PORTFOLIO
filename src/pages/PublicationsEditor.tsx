import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';
import { githubService } from '@/services/github';
import type { Publication } from '@/types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
// Import updates arrays from data/publications.updates.ts
import { publicationsUpdates, booksUpdates, bookChaptersUpdates, journalArticlesUpdates, proceedingsArticlesUpdates } from '../../data/publications.updates';

interface PublicationsEditorProps {
  onLogout: () => void;
}

export default function PublicationsEditor({ onLogout }: PublicationsEditorProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sha, setSha] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const result = await githubService.getData<Publication>('publications');
      console.log('📊 Loaded publications:', result.data.length, 'records');
      console.log('📋 Records:', result.data);
      setPublications(result.data);
      setSha(result.sha);
      setError('');
    } catch (err) {
      setError('Failed to load publications. Check GitHub configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newPublication: Publication = {
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      type: 'journal',
    };
    setEditForm(newPublication);
    setEditingIndex(-1); // -1 indicates new item
  };

  const handleEdit = (index: number) => {
    setEditForm({ ...publications[index] });
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }

    try {
      setSaving(true);
      const updated = publications.filter((_, i) => i !== index);
      await githubService.updateData(
        'publications',
        updated,
        'Publication',
        'publications',
        `Deleted publication: ${publications[index].title}`,
        sha
      );

      // Track delete in the appropriate array
      const deletedPublication = publications[index];
      const updateData = {
        timestamp: new Date().toISOString(),
        action: 'delete',
        data: deletedPublication
      };

      // Push to specific type array
      if (deletedPublication.type === 'book') {
        booksUpdates.push(updateData);
      } else if (deletedPublication.type === 'book-chapter') {
        bookChaptersUpdates.push(updateData);
      } else if (deletedPublication.type === 'journal') {
        journalArticlesUpdates.push(updateData);
      } else if (deletedPublication.type === 'conference' || deletedPublication.type === 'proceedings') {
        proceedingsArticlesUpdates.push(updateData);
      }

      // Also push to general publications updates
      publicationsUpdates.push(updateData);

      await loadPublications();
    } catch (err) {
      setError('Failed to delete publication');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    // Validation
    if (!editForm.title || !editForm.authors || !editForm.journal) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let updated: Publication[];
      let message: string;

      if (editingIndex === -1) {
        // Adding new
        updated = [...publications, editForm];
        message = `Added publication: ${editForm.title}`;
      } else if (editingIndex !== null) {
        // Editing existing
        updated = [...publications];
        updated[editingIndex] = editForm;
        message = `Updated publication: ${editForm.title}`;
      } else {
        return;
      }

      // Safety check: Confirm before saving
      const confirmMsg = editingIndex === -1 
        ? `Add new publication?\n\nCurrent: ${publications.length} records\nAfter save: ${updated.length} records\n\nNew: ${editForm.title}`
        : `Update publication?\n\nTitle: ${editForm.title}\nTotal records: ${updated.length}`;
      
      if (!confirm(confirmMsg)) {
        setSaving(false);
        return;
      }

      console.log('💾 Saving publications...');
      console.log('📊 Current records:', publications.length);
      console.log('📊 Updated records:', updated.length);
      console.log('📋 Updated data:', updated);

      await githubService.updateData(
        'publications',
        updated,
        'Publication',
        'publications',
        message,
        sha
      );

      // Track update in the appropriate array
      const updateData = {
        timestamp: new Date().toISOString(),
        action: editingIndex === -1 ? 'add' : 'edit',
        data: editForm
      };

      // Push to specific type array
      if (editForm.type === 'book') {
        booksUpdates.push(updateData);
      } else if (editForm.type === 'book-chapter') {
        bookChaptersUpdates.push(updateData);
      } else if (editForm.type === 'journal') {
        journalArticlesUpdates.push(updateData);
      } else if (editForm.type === 'conference' || editForm.type === 'proceedings') {
        proceedingsArticlesUpdates.push(updateData);
      }

      // Also push to general publications updates
      publicationsUpdates.push(updateData);

      console.log('✅ Save successful! Reloading data...');
      await loadPublications();
      setEditForm(null);
      setEditingIndex(null);
      alert('✅ Saved successfully!');
    } catch (err) {
      setError('Failed to save publication');
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
        title="Publications"
        description="Manage journal articles, conference papers, and book chapters"
        onLogout={onLogout}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading publications...</p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Publications"
      description="Manage journal articles, conference papers, and book chapters"
      onLogout={onLogout}
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add New Button */}
      {!editForm && (
        <div className="mb-6">
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Publication
          </button>
        </div>
      )}

      {/* Edit Form */}
      {editForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingIndex === -1 ? 'Add New Publication' : 'Edit Publication'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="input"
                placeholder="Publication title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authors *
              </label>
              <input
                type="text"
                value={editForm.authors}
                onChange={(e) => setEditForm({ ...editForm, authors: e.target.value })}
                className="input"
                placeholder="List of authors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Journal/Conference *
                </label>
                <input
                  type="text"
                  value={editForm.journal}
                  onChange={(e) => setEditForm({ ...editForm, journal: e.target.value })}
                  className="input"
                  placeholder="Publication venue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                  className="input"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type * <span className="text-gray-500 text-xs">(Select publication type)</span>
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Publication['type'] })}
                  className="input"
                >
                  <option value="journal">📄 Journal Article</option>
                  <option value="conference">🎤 Conference Paper</option>
                  <option value="proceedings">📋 Conference Proceedings</option>
                  <option value="book-chapter">📖 Book Chapter</option>
                  <option value="book">📚 Book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DOI
                </label>
                <input
                  type="text"
                  value={editForm.doi || ''}
                  onChange={(e) => setEditForm({ ...editForm, doi: e.target.value })}
                  className="input"
                  placeholder="10.1234/example"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL <span className="text-gray-500 text-xs">(Optional - Book cover or thumbnail)</span>
              </label>
              <input
                type="url"
                value={editForm.imageUrl || ''}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                className="input"
                placeholder="https://example.com/book-cover.jpg"
              />
              {editForm.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={editForm.imageUrl} 
                    alt="Cover preview" 
                    className="h-32 w-auto object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="btn btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publications List */}
      <div className="space-y-4">
        {publications.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No publications yet. Click "Add New Publication" to get started.</p>
          </div>
        ) : (
          publications.map((pub, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {pub.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{pub.authors}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>{pub.journal}</span>
                    <span>•</span>
                    <span>{pub.year}</span>
                    <span>•</span>
                    <span className="capitalize">{pub.type.replace('-', ' ')}</span>
                    {pub.doi && (
                      <>
                        <span>•</span>
                        <span>DOI: {pub.doi}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
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
