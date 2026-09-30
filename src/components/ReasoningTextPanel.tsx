import type { Proposition } from '../domain/types';

export function ReasoningTextPanel({ text, propositions, selectedId, onSelect }: { text: string; propositions: Proposition[]; selectedId?: string; onSelect: (id: string) => void }) {
  return <section className="workspace-panel text-panel"><div className="panel-heading"><div><p className="eyebrow">SOURCE TEXT / REASONING</p><h2>裁判理由原文</h2></div><span className="index-badge">{text.length} chars</span></div><div className="source-text">{propositions.length ? propositions.map((item) => <button key={item.id} className={`source-proposition ${selectedId === item.id ? 'selected' : ''}`} onClick={() => onSelect(item.id)}><sup>{item.number}</sup>{item.text}</button>) : <p>{text}</p>}</div><div className="text-footer"><span>基于字符索引定位</span><span>范围：0 — {text.length}</span></div></section>;
}
