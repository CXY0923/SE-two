import type { AppState, AnnotationVersion, DocumentRecord, Proposition, Relation, Task, UserRecord } from './types';

const reasoningText =
  '依法成立的合同，自成立时生效。当事人应当按照约定全面履行自己的义务。当事人一方未支付价款、报酬、租金、利息，或者不履行其他金钱债务的，对方可以请求其支付。本案中，原、被告之间系劳务合同关系，原告已依约提供劳务，被告应按照原、被告之间的约定给付劳务报酬。根据原告提交的欠条、微信转账记录可以认定，被告尚欠原告劳务报酬11000元，被告应向原告支付该11000元。原告主张另有劳务报酬600元，但其提供的证据不足以证明其主张，对其主张被告支付该600元劳务报酬的请求，本院不予支持。';

const p = (id: string, number: number, text: string, start: number, primaryLabel: Proposition['primaryLabel'], secondaryLabel?: string): Proposition => ({
  id,
  number,
  text,
  start,
  end: start + text.length,
  primaryLabel,
  secondaryLabel,
});

const propositions: Proposition[] = [
  p('p1', 1, '依法成立的合同，自成立时生效。', 0, 'GM', 'GM-L'),
  p('p2', 2, '当事人应当按照约定全面履行自己的义务。', 18, 'GM', 'GM-L'),
  p('p3', 3, '本案中，原、被告之间系劳务合同关系。', 82, 'SM', 'SM-C'),
  p('p4', 4, '原告已依约提供劳务。', 103, 'SF'),
  p('p5', 5, '被告应按照约定给付劳务报酬。', 113, 'SM'),
  p('p6', 6, '被告尚欠原告劳务报酬11000元。', 157, 'SF'),
  p('p7', 7, '被告应向原告支付该11000元。', 174, 'SM'),
];

const relations: Relation[] = [
  { id: 'r1', type: 'J', members: ['p3', 'p4'] },
  { id: 'r2', type: 'M', members: ['p3', 'p4'], target: 'p2', nested: ['r1'] },
  { id: 'r3', type: 'S', members: ['p2'], target: 'p5', nested: ['r2'] },
  { id: 'r4', type: 'S', members: ['p6'], target: 'p7' },
];

const secondPropositions = propositions.map((item) => ({ ...item, id: `${item.id}-b` }));
secondPropositions[3] = { ...secondPropositions[3], primaryLabel: 'GF' };

const documentRecord: DocumentRecord = {
  id: 'doc-1',
  name: '余某与徐某劳务合同纠纷民事一审判决书',
  caseType: '普通案例',
  sourceText: reasoningText,
  reasoningText,
  reasoningStart: 0,
  reasoningEnd: reasoningText.length,
  assignedAnnotatorIds: ['u-annotator-1', 'u-annotator-2'],
};

const users: UserRecord[] = [
  { id: 'u-owner', name: '林老师', roles: ['任务创建者', '裁定者'] },
  { id: 'u-annotator-1', name: '张同学', roles: ['标注者'] },
  { id: 'u-annotator-2', name: '李同学', roles: ['标注者'] },
];

const task: Task = {
  id: 'task-1',
  name: '劳务合同纠纷论证结构试标',
  description: '用于验证裁判理由命题、关系和嵌套图示的完整流程。',
  guideVersion: 'v1.1',
  stage: 'adjudicating',
  documentIds: ['doc-1'],
  annotatorIds: ['u-annotator-1', 'u-annotator-2'],
  adjudicatorIds: ['u-owner'],
  createdAt: '2026-09-30T09:00:00.000Z',
};

const versionA: AnnotationVersion = {
  id: 'version-a', documentId: 'doc-1', annotatorId: 'u-annotator-1', status: 'submitted', propositions, relations, updatedAt: '2026-09-30T10:30:00.000Z',
};
const versionB: AnnotationVersion = {
  id: 'version-b', documentId: 'doc-1', annotatorId: 'u-annotator-2', status: 'submitted', propositions: secondPropositions, relations: relations.map((item) => ({ ...item, id: `${item.id}-b` })), updatedAt: '2026-09-30T10:42:00.000Z',
};

export const initialStore: AppState = {
  currentUserId: 'u-owner',
  tasks: { [task.id]: task },
  documents: { [documentRecord.id]: documentRecord },
  users: Object.fromEntries(users.map((user) => [user.id, user])),
  annotationVersions: { [versionA.id]: versionA, [versionB.id]: versionB },
  adjudications: {},
  exportRecords: [],
};
