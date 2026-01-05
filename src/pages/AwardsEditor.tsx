import EditorLayout from '@/components/EditorLayout';

interface AwardsEditorProps {
  onLogout: () => void;
}

export default function AwardsEditor({ onLogout }: AwardsEditorProps) {
  return (
    <EditorLayout
      title="Awards & Honors"
      description="Manage awards, recognitions, and certificates"
      onLogout={onLogout}
    >
      <div className="card">
        <p className="text-gray-600">
          Awards editor coming soon. Will follow the same pattern as Publications editor.
        </p>
      </div>
    </EditorLayout>
  );
}
