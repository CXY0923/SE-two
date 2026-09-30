import type { AppState, Proposition, Relation, TaskStage } from './types';
import { advanceTask } from './validation';

export type AppAction =
  | { type: 'create-task'; task: import('./types').Task }
  | { type: 'advance-task'; taskId: string; next: TaskStage; versionCount?: number; hasFinal?: boolean }
  | { type: 'update-proposition'; versionId: string; propositionId: string; patch: Partial<Proposition> }
  | { type: 'add-proposition'; versionId: string; proposition: Proposition }
  | { type: 'remove-proposition'; versionId: string; propositionId: string }
  | { type: 'add-relation'; versionId: string; relation: Relation }
  | { type: 'submit-version'; versionId: string }
  | { type: 'add-export'; record: import('./types').ExportRecord };
  

export function appReducer(state: AppState, action: AppAction): AppState {
  if (action.type === 'create-task') return { ...state, tasks: { ...state.tasks, [action.task.id]: action.task } };
  if (action.type === 'add-export') return { ...state, exportRecords: [...state.exportRecords, action.record] };
  if (action.type === 'advance-task') {
    const task = state.tasks[action.taskId];
    return { ...state, tasks: { ...state.tasks, [task.id]: advanceTask(task, action.next, action.versionCount, action.hasFinal) } };
  }
  if (action.type === 'update-proposition' || action.type === 'add-proposition' || action.type === 'remove-proposition' || action.type === 'add-relation' || action.type === 'submit-version') {
    const version = state.annotationVersions[action.versionId];
    if (version.status === 'submitted' && action.type !== 'submit-version') return state;
    let nextVersion = version;
    if (action.type === 'update-proposition') nextVersion = { ...version, propositions: version.propositions.map((item) => item.id === action.propositionId ? { ...item, ...action.patch } : item) };
    if (action.type === 'add-proposition') nextVersion = { ...version, propositions: [...version.propositions, action.proposition] };
    if (action.type === 'remove-proposition') nextVersion = { ...version, propositions: version.propositions.filter((item) => item.id !== action.propositionId), relations: version.relations.filter((relation) => !relation.members.includes(action.propositionId) && relation.target !== action.propositionId) };
    if (action.type === 'add-relation') nextVersion = { ...version, relations: [...version.relations, action.relation] };
    if (action.type === 'submit-version') nextVersion = { ...version, status: 'submitted' };
    return { ...state, annotationVersions: { ...state.annotationVersions, [version.id]: nextVersion } };
  }
  return state;
}
