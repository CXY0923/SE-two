import type { ReactNode } from 'react';
import { BookOpen, ClipboardList, Home, Settings2 } from 'lucide-react';
import type { AppState } from '../domain/types';

export type AppView = 'overview' | 'create' | 'task' | 'annotate' | 'adjudicate' | 'export';

export function AppShell({ state, view, onNavigate, children }: { state: AppState; view: AppView; onNavigate: (view: AppView) => void; children: ReactNode }) {
  const user = state.users[state.currentUserId];
  return <div className="app-shell"><aside className="rail"><div className="brand-mark"><span>理</span><div><strong>理据</strong><small>ARGUMENT LAB</small></div></div><div className="rail-label">工作台</div><nav><button className={view === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('overview')}><Home size={17} /><span>任务总览</span></button><button className={view === 'create' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('create')}><ClipboardList size={17} /><span>创建任务</span></button></nav><div className="rail-spacer" /><div className="guide-chip"><BookOpen size={16} /><div><span>当前指南</span><strong>v1.1 中文裁判文书</strong></div></div><button className="nav-item"><Settings2 size={17} /><span>工作台设置</span></button><div className="user-chip"><div className="avatar">{user?.name.slice(0, 1)}</div><div><strong>{user?.name}</strong><span>{user?.roles.join(' · ')}</span></div></div></aside><main className="main-canvas">{children}</main></div>;
}
