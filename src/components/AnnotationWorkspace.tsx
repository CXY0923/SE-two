import { ArrowLeft, Check, RefreshCw, Undo2 } from 'lucide-react';
import { useState } from 'react';
import type { AppState } from '../domain/types';
import type { AppAction } from '../domain/store';
import { ArgumentGraph } from './ArgumentGraph';
import { PropositionPanel } from './PropositionPanel';
import { ReasoningTextPanel } from './ReasoningTextPanel';

export function AnnotationWorkspace({ state, versionId, readOnly, onDispatch, onBack }: { state: AppState; versionId: string; readOnly: boolean; onDispatch: (action: AppAction) => void; onBack?: () => void }) {
  const version = state.annotationVersions[versionId]; const doc = state.documents[version.documentId]; const [selectedId, setSelectedId] = useState(version.propositions[0]?.id);
  return <div className="workspace-page"><header className="workspace-header"><div><button className="back-button" onClick={onBack}><ArrowLeft size={15} />任务详情</button><p className="eyebrow">ANNOTATION WORKSPACE / {readOnly ? 'READ ONLY' : 'DRAFT VERSION'}</p><h1>{doc.name}</h1><span className="workspace-sub">{state.users[version.annotatorId].name} 的标注版本 · {version.propositions.length} 个命题 · {version.relations.length} 个关系</span></div><div className="workspace-actions"><button className="icon-button"><Undo2 size={16} /></button><button className="icon-button"><RefreshCw size={16} /></button>{!readOnly && <button className="primary-button" onClick={() => onDispatch({ type: 'submit-version', versionId })}><Check size={16} />提交版本</button>}</div></header><div className="workspace-grid"><ReasoningTextPanel text={doc.reasoningText} propositions={version.propositions} selectedId={selectedId} onSelect={setSelectedId} /><PropositionPanel state={state} version={version} selectedId={selectedId} onSelect={setSelectedId} onDispatch={onDispatch} readOnly={readOnly} /><section className="workspace-panel graph-panel"><div className="panel-heading"><div><p className="eyebrow">ARGUMENT MAP / LIVE</p><h2>论证图示</h2></div><span className="graph-status"><i />实时同步</span></div><ArgumentGraph propositions={version.propositions} relations={version.relations} selectedId={selectedId} onSelect={setSelectedId} /></section></div></div>;
}
