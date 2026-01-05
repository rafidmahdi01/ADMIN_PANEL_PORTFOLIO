import EditorLayout from '@/components/EditorLayout';

interface PresentationsEditorProps {
  onLogout: () => void;
}

export default function PresentationsEditor({ onLogout }: PresentationsEditorProps) {
  return (
    <EditorLayout
      title="Presentations"
      description="Manage keynotes, invited talks, and conference presentations"
      onLogout={onLogout}
    >
      <div className="card">
        <p className="text-gray-600">
          Presentations editor coming soon. Will follow the same pattern as Publications editor.
        </p>
      </div>
    </EditorLayout>
  );
}
