import EditorLayout from '@/components/EditorLayout';

interface SupervisionEditorProps {
  onLogout: () => void;
}

export default function SupervisionEditor({ onLogout }: SupervisionEditorProps) {
  return (
    <EditorLayout
      title="Student Supervision"
      description="Manage PhD, Masters, and undergraduate student records"
      onLogout={onLogout}
    >
      <div className="card">
        <p className="text-gray-600">
          Supervision editor coming soon. Will follow the same pattern as Publications editor.
        </p>
      </div>
    </EditorLayout>
  );
}
