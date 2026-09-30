import type { AnnotationVersion, PropositionLabel, Task, TaskStage } from './types';

const stages: TaskStage[] = ['draft', 'annotating', 'adjudicating', 'adjudicated', 'exported'];

export function validateVersion(version: AnnotationVersion): string[] {
  const errors: string[] = [];
  if (version.propositions.some((item) => !item.primaryLabel)) errors.push('提交前必须完成命题一级标签');
  if (version.propositions.some((item) => item.start < 0 || item.end <= item.start)) errors.push('命题字符索引无效');
  if (version.propositions.some((item) => ['GM', 'SM'].includes(item.primaryLabel ?? '') && !item.secondaryLabel)) errors.push('GM 和 SM 命题必须完成二级标签');
  const propositionIds = new Set(version.propositions.map((item) => item.id));
  for (const relation of version.relations) {
    if (relation.members.length < (['J', 'I'].includes(relation.type) ? 2 : 1)) errors.push(`${relation.type} 关系至少需要两个参与对象`);
    if (relation.members.some((id) => !propositionIds.has(id)) || (relation.target && !propositionIds.has(relation.target))) errors.push('关系引用了不存在的命题');
    if (relation.type === 'M') {
      const labels = relation.members.map((id) => version.propositions.find((item) => item.id === id)?.primaryLabel);
      const targetLabel = relation.target ? version.propositions.find((item) => item.id === relation.target)?.primaryLabel : undefined;
      if (!labels.some((label) => ['SF', 'SM'].includes(label ?? '')) || !['GF', 'GM'].includes(targetLabel ?? '')) errors.push('M 关系必须连接个别判断与一般判断');
    }
  }
  return errors;
}

export function canAdvance(stage: TaskStage, versionCount: number, hasFinal: boolean): boolean {
  if (stage === 'draft') return true;
  if (stage === 'annotating') return versionCount > 0;
  if (stage === 'adjudicating') return hasFinal;
  if (stage === 'adjudicated') return true;
  return false;
}

export function advanceTask(task: Task, next: TaskStage, versionCount = 1, hasFinal = false): Task {
  const currentIndex = stages.indexOf(task.stage);
  const nextIndex = stages.indexOf(next);
  if (nextIndex <= currentIndex) throw new Error('任务阶段只能向前推进');
  if (!canAdvance(task.stage, versionCount, hasFinal)) throw new Error('当前阶段尚未满足推进条件');
  return { ...task, stage: next };
}

export const isPropositionLabel = (value: string): value is PropositionLabel => ['IS', 'Non', 'GM', 'SM', 'GF', 'SF'].includes(value);
