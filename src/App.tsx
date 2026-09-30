import { useReducer, useState } from 'react';
import { initialStore } from './domain/mockData';
import { appReducer } from './domain/store';
import type { ExportRecord } from './domain/types';
import { AppShell, type AppView } from './components/AppShell';
import { TaskOverview } from './components/TaskOverview';
import { CreateTaskWizard } from './components/CreateTaskWizard';
import { TaskDetail } from './components/TaskDetail';
import { AnnotationWorkspace } from './components/AnnotationWorkspace';
import { AdjudicationView } from './components/AdjudicationView';
import { ExportView } from './components/ExportView';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialStore);
  const [view, setView] = useState<AppView>('overview');
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  const navigate = (next: AppView) => setView(next);
  return <AppShell state={state} view={view} onNavigate={navigate}>{view === 'overview' && <TaskOverview state={state} onNavigate={navigate} />}{view === 'create' && <CreateTaskWizard state={state} onNavigate={navigate} onCreated={(task) => { dispatch({ type: 'create-task', task }); notify('任务草稿已保存'); navigate('task'); }} />}{view === 'task' && <TaskDetail state={state} onNavigate={navigate} />}{view === 'annotate' && <AnnotationWorkspace state={state} versionId="version-a" readOnly={false} onDispatch={dispatch} onBack={() => navigate('task')} />}{view === 'adjudicate' && <AdjudicationView state={state} onNavigate={navigate} onAdjudicate={(versionId) => notify(`已选择 ${versionId === 'version-a' ? '版本 A' : '版本 B'}，可继续编辑最终结果`)} />}{view === 'export' && <ExportView state={state} onNavigate={navigate} onExport={(record: ExportRecord) => { dispatch({ type: 'add-export', record } as never); notify(`${record.filename} 已准备下载`); }} />}{toast && <div className="toast">{toast}</div>}</AppShell>;
}
