export type TaskStage = 'draft' | 'annotating' | 'adjudicating' | 'adjudicated' | 'exported';
export type PropositionLabel = 'IS' | 'Non' | 'GM' | 'SM' | 'GF' | 'SF';
export type RelationType = 'S' | 'A' | 'J' | 'M' | 'I';

export interface Proposition {
  id: string;
  number: number;
  text: string;
  start: number;
  end: number;
  primaryLabel?: PropositionLabel;
  secondaryLabel?: string;
}

export interface Relation {
  id: string;
  type: RelationType;
  members: string[];
  target?: string;
  nested?: string[];
}

export interface AnnotationVersion {
  id: string;
  documentId: string;
  annotatorId: string;
  status: 'draft' | 'submitted';
  propositions: Proposition[];
  relations: Relation[];
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  caseType: string;
  sourceText: string;
  reasoningText: string;
  reasoningStart: number;
  reasoningEnd: number;
  assignedAnnotatorIds: string[];
}

export interface UserRecord {
  id: string;
  name: string;
  roles: string[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  guideVersion: string;
  stage: TaskStage;
  documentIds: string[];
  annotatorIds: string[];
  adjudicatorIds: string[];
  createdAt: string;
}

export interface Adjudication {
  id: string;
  documentId: string;
  sourceVersionId?: string;
  finalVersionId: string;
  adjudicatorId: string;
  note: string;
  submittedAt: string;
}

export interface ExportRecord {
  id: string;
  format: 'JSON' | 'Excel' | 'PNG' | 'JPG' | 'SVG' | 'ZIP';
  filename: string;
  userId: string;
  guideVersion: string;
  status: 'completed';
  createdAt: string;
}

export interface AppState {
  currentUserId: string;
  tasks: Record<string, Task>;
  documents: Record<string, DocumentRecord>;
  users: Record<string, UserRecord>;
  annotationVersions: Record<string, AnnotationVersion>;
  adjudications: Record<string, Adjudication>;
  exportRecords: ExportRecord[];
}
