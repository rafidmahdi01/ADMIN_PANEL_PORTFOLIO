import EditorLayout from '@/components/EditorLayout';

interface EvaluationEditorProps {
  onLogout: () => void;
}

export default function EvaluationEditor({ onLogout }: EvaluationEditorProps) {
  return (
    <EditorLayout
      title="Evaluation & Service"
      description="Manage evaluation activities and academic service"
      onLogout={onLogout}
    >
      <div className="card">
        <p className="text-gray-600">
          Evaluation editor coming soon. Will follow the same pattern as Publications editor.
        </p>
      </div>
    </EditorLayout>
  );
}
