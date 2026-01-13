// Types matching your existing data structures

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  type: 'journal' | 'conference' | 'book-chapter' | 'book' | 'proceedings';
  pdfUrl?: string;
  imageUrl?: string;
}

export interface Award {
  title: string;
  organization: string; // Keep for backward compatibility
  institution?: string; // New field
  date: string; // Keep for backward compatibility
  year?: string; // New field
  category?: 'awards' | 'services' | 'honors' | 'fellowships';
  type?: string; // Custom type description
  description?: string;
  certificateUrl?: string;
}

export interface Presentation {
  title: string;
  event: string;
  location: string;
  date: string; // Keep for backward compatibility
  startDate?: string; // New field for date range
  endDate?: string; // New field for date range
  year?: string; // Display year
  type: 'keynote' | 'invited' | 'event-organiser' | 'oral-presenter';
  scope?: 'international' | 'national' | 'regional';
  slidesUrl?: string;
}

export interface ResearchProject {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'ongoing' | 'completed';
  fundingAgency?: string;
  amount?: string;
  grantNumber?: string; // Grant No field
  role?: 'project-leader' | 'co-investigator' | 'researcher' | 'consultant';
  location?: string; // Country/Location
  scope?: 'international' | 'national' | 'regional';
}

export interface Supervision {
  studentName: string;
  level: 'phd' | 'masters' | 'masters-by-research' | 'undergraduate';
  topic: string;
  year: string;
  status: 'ongoing' | 'completed';
  role?: 'main-supervisor' | 'co-supervisor' | 'advisor' | 'examiner';
}

export interface Evaluation {
  position: string;
  organization: string;
  period: string;
  description: string;
  category?: 'journal-editorial' | 'thesis-evaluation' | 'academic-promotion' | 'all';
  type?: string; // Article in Journal, etc.
  startDate?: string;
  endDate?: string;
}

export type DataType = 'publications' | 'awards' | 'presentations' | 'research-projects' | 'supervision' | 'evaluation';

export interface GitHubFileResponse {
  content: string;
  sha: string;
  path: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: string;
}
