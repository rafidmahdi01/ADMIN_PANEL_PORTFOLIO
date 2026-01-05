import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Presentation, 
  Microscope, 
  Users, 
  ClipboardList,
  LogOut,
  Github
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const sections = [
  {
    id: 'publications',
    title: 'Publications',
    description: 'Manage journal articles, conference papers, and book chapters',
    icon: BookOpen,
    color: 'bg-blue-500',
    path: '/publications'
  },
  {
    id: 'awards',
    title: 'Awards & Honors',
    description: 'Add and update awards, recognitions, and certificates',
    icon: Award,
    color: 'bg-yellow-500',
    path: '/awards'
  },
  {
    id: 'presentations',
    title: 'Presentations',
    description: 'Manage keynotes, invited talks, and conference presentations',
    icon: Presentation,
    color: 'bg-purple-500',
    path: '/presentations'
  },
  {
    id: 'research-projects',
    title: 'Research Projects',
    description: 'Update ongoing and completed research projects',
    icon: Microscope,
    color: 'bg-green-500',
    path: '/research-projects'
  },
  {
    id: 'supervision',
    title: 'Student Supervision',
    description: 'Manage PhD, Masters, and undergraduate student records',
    icon: Users,
    color: 'bg-indigo-500',
    path: '/supervision'
  },
  {
    id: 'evaluation',
    title: 'Evaluation & Service',
    description: 'Update evaluation activities and academic service',
    icon: ClipboardList,
    color: 'bg-red-500',
    path: '/evaluation'
  }
];

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-500">
                  Dr. Noor Zaman Portfolio
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">
            Select a section below to manage portfolio content
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                to={section.path}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${section.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            How it works
          </h3>
          <ul className="space-y-2 text-primary-800">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">1.</span>
              <span>Click on any section to view and edit content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">2.</span>
              <span>Add, edit, or delete entries using the forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">3.</span>
              <span>Changes are automatically saved to GitHub</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">4.</span>
              <span>Your portfolio will rebuild automatically (1-2 minutes)</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
