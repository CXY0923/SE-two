import { describe, expect, it } from 'vitest';
import { advanceTask, validateVersion } from './validation';
import type { AnnotationVersion, Task } from './types';

const version: AnnotationVersion = {
  id: 'v', documentId: 'd', annotatorId: 'u', status: 'draft', updatedAt: '',
  propositions: [{ id: 'p', number: 1, text: '命题', start: 0, end: 2 }], relations: [],
};
const task: Task = {
  id: 't', name: '任务', description: '', guideVersion: 'v1.1', stage: 'adjudicated', documentIds: [], annotatorIds: [], adjudicatorIds: [], createdAt: '',
};

describe('annotation validation', () => {
  it('requires labels before a version can be submitted', () => {
    const errors = validateVersion(version);
    expect(errors).toContain('提交前必须完成命题一级标签');
  });

  it('rejects a backward task transition', () => {
    expect(() => advanceTask(task, 'annotating')).toThrow('任务阶段只能向前推进');
  });
});
