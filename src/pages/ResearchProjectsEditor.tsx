import EditorLayout from '@/components/EditorLayout';

interface ResearchProjectsEditorProps {
  onLogout: () => void;
}

export default function ResearchProjectsEditor({ onLogout }: ResearchProjectsEditorProps) {
  return (
    <EditorLayout
      title="Research Projects"
      description="Manage ongoing and completed research projects"
      onLogout={onLogout}
    >
      <div className="card">
        <p className="text-gray-600">
          Research Projects editor coming soon. Will follow the same pattern as Publications editor.
        </p>
      </div>
    </EditorLayout>
  );
}
