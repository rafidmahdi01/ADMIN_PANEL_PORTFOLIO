// Types matching your existing data structures

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  type: 'journal' | 'conference' | 'book-chapter';
  pdfUrl?: string;
  imageUrl?: string;
}

export interface Award {
  title: string;
  organization: string;
  date: string;
  description?: string;
  certificateUrl?: string;
}

export interface Presentation {
  title: string;
  event: string;
  location: string;
  date: string;
  type: 'keynote' | 'invited' | 'contributed';
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
}

export interface Supervision {
  studentName: string;
  level: 'phd' | 'masters' | 'undergraduate';
  topic: string;
  year: string;
  status: 'ongoing' | 'completed';
}

export interface Evaluation {
  position: string;
  organization: string;
  period: string;
  description: string;
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
