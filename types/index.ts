export type IssueCategory =
  | 'Pothole'
  | 'Sanitation'
  | 'Lighting'
  | 'Water & Drainage'
  | 'Road Hazard'
  | 'Vandalism';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ReportStatus = 'Open' | 'In Progress' | 'Resolved';

export type LocationSource = 'exif' | 'gps' | 'manual';

export interface CommunityAction {
  action_plan: string;
  required_tools: string[];
  safety_warning: string;
  suggested_resolution: string;
}

export interface ResolutionProof {
  image_url: string;
  verified_at: string;
  note?: string;
}

export interface CivicReport {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  urgency_score: number; // 1 to 10
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    neighborhood: string; // e.g. Agdal, Hassan, Médina, Technopolis
    source: LocationSource;
  };
  image_url: string;
  resolution_proof?: ResolutionProof;
  voice_transcript?: string;
  community_action: CommunityAction;
  status: ReportStatus;
  upvotes: number;
  community_verifications: number;
  created_at: string;
  model_used: string;
  skills_executed: string[];
  privacy_vetted: boolean;
}

export interface SkillDefinition {
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
}
