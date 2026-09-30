# 裁判文书法律论证标注原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a desktop Web prototype that demonstrates the confirmed four-stage annotation workflow with mock data: create task, annotate independently, adjudicate versions, and export final results.

**Architecture:** A small React + TypeScript single-page app with a route-like view state (`overview`, `create`, `task`, `annotate`, `adjudicate`, `export`) and a reducer-backed in-memory store. Domain data and validators stay separate from UI components. The annotation workspace renders a text panel, proposition editor, and SVG argument graph from the same state so edits stay synchronized.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS. No backend and no external UI kit.

## Global Constraints

- Desktop-first Web prototype; no authentication or server APIs.
- Four task stages are forward-only: `draft -> annotating -> adjudicating -> adjudicated -> exported`.
- Proposition indices use `[start, end)` over the extracted reasoning text.
- Proposition labels: IS, Non, GM, SM, GF, SF; GM sublabels GM-L/GM-I/GM-C/GM-U/GM-M/GM-O; SM sublabel SM-C.
- Relations: S, A, J, M, I, including nested relation units.
- A submitted annotation version and an exported final result are read-only.
- Use the real supplied Chinese legal sample text in mock data, not lorem ipsum.
- Visual direction: warm paper `#F4F0E8`, ink `#1F2523`, muted teal `#477A73`, vermilion `#B94E3D`, ochre `#C89B53`, serif display face with system Chinese fallback, readable sans-serif UI face.

## Task 1: Scaffold the React app and domain types

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/domain/types.ts`
- Create: `src/domain/labels.ts`
- Create: `src/domain/mockData.ts`
- Create: `src/styles.css`
- Test: `src/domain/types.test.ts`

**Interfaces:**
- `TaskStage = 'draft' | 'annotating' | 'adjudicating' | 'adjudicated' | 'exported'`.
- `Proposition { id: string; number: number; text: string; start: number; end: number; primaryLabel?: PropositionLabel; secondaryLabel?: string; }`.
- `Relation { id: string; type: RelationType; members: string[]; target?: string; }`.
- `AnnotationVersion { id: string; documentId: string; annotatorId: string; status: 'draft' | 'submitted'; propositions: Proposition[]; relations: Relation[]; }`.
- `Task { id: string; name: string; guideVersion: string; stage: TaskStage; documentIds: string[]; annotatorIds: string[]; adjudicatorIds: string[]; }`.
- Export `initialStore` containing one complete example task, two submitted versions, one nested relation, and one finalized result.

- [ ] **Step 1: Write the failing type/data test**

```ts
import { describe, expect, it } from 'vitest';
import { initialStore } from './mockData';

describe('mock annotation scenario', () => {
  it('contains two submitted versions and a nested relation', () => {
    const versions = Object.values(initialStore.annotationVersions);
    expect(versions.filter(v => v.status === 'submitted')).toHaveLength(2);
    expect(versions.some(v => v.relations.some(r => r.members.length > 2))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails because the app does not exist**

Run: `npm test -- --run src/domain/types.test.ts`
Expected: FAIL because `package.json` and `src/domain/mockData.ts` do not exist.

- [ ] **Step 3: Create the Vite/TypeScript scaffold and domain models**

Add the files listed above. Keep all label and relation definitions in `labels.ts`, all sample data in `mockData.ts`, and keep the sample reasoning text from the supplied guide in `mockData.ts`.

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- --run src/domain/types.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json index.html src
git commit -m "feat: scaffold annotation prototype"
```

## Task 2: Add reducer state transitions and validation

**Files:**
- Create: `src/domain/validation.ts`
- Create: `src/domain/store.ts`
- Test: `src/domain/validation.test.ts`

**Interfaces:**
- `validateVersion(version: AnnotationVersion): string[]` returns blocking messages.
- `canAdvance(stage: TaskStage, versionCount: number, hasFinal: boolean): boolean`.
- `advanceTask(task: Task, next: TaskStage): Task` throws when the transition is not forward or prerequisites are missing.
- `appReducer(state: AppState, action: AppAction): AppState` handles task stage, proposition, relation, submission, adjudication and export actions.

- [ ] **Step 1: Write failing validation tests**

```ts
it('requires labels before a version can be submitted', () => {
  const errors = validateVersion({ ...version, propositions: [{ ...proposition, primaryLabel: undefined }] });
  expect(errors).toContain('提交前必须完成命题一级标签');
});

it('rejects a backward task transition', () => {
  expect(() => advanceTask({ ...task, stage: 'adjudicated' }, 'annotating')).toThrow('任务阶段只能向前推进');
});
```

- [ ] **Step 2: Run tests and verify the expected failures**

Run: `npm test -- --run src/domain/validation.test.ts`
Expected: FAIL because validation functions do not exist.

- [ ] **Step 3: Implement the reducer and validators**

Validate half-open indices, required labels, M type constraints, minimum members for J/I, and references to existing propositions. Keep reducer actions pure and return new state objects.

- [ ] **Step 4: Run all domain tests**

Run: `npm test -- --run src/domain`
Expected: PASS with no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/domain
git commit -m "feat: add annotation workflow state and validation"
```

## Task 3: Build the task overview, creation wizard, and task detail views

**Files:**
- Create: `src/components/AppShell.tsx`
- Create: `src/components/TaskOverview.tsx`
- Create: `src/components/CreateTaskWizard.tsx`
- Create: `src/components/TaskDetail.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Test: `src/components/task-flow.test.tsx`

**Interfaces:**
- `AppShell` receives `view`, `onNavigate`, `children`.
- `CreateTaskWizard` receives `onCreated(taskId: string)`.
- `TaskDetail` receives `taskId` and `onNavigate`.

- [ ] **Step 1: Write failing interaction tests**

Test that the overview renders the seeded task, the wizard has four steps, and submitting basic info creates a task and returns to the detail view.

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- --run src/components/task-flow.test.tsx`
Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the views**

Use a left navigation rail, a compact stage tracker, and dense but breathable data tables. The task detail view must disable earlier-stage mutation actions after advancement and show the guide version and document assignment summary.

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- --run src/components/task-flow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/App.tsx src/styles.css
git commit -m "feat: add task management views"
```

## Task 4: Build the annotation workspace and SVG argument graph

**Files:**
- Create: `src/components/AnnotationWorkspace.tsx`
- Create: `src/components/ReasoningTextPanel.tsx`
- Create: `src/components/PropositionPanel.tsx`
- Create: `src/components/ArgumentGraph.tsx`
- Create: `src/domain/numbering.ts`
- Test: `src/domain/numbering.test.ts`
- Test: `src/components/annotation-workspace.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `renumberPropositions(propositions): Proposition[]` sorts by `start`, then assigns 1-based numbers.
- `AnnotationWorkspace` receives `versionId` and `readOnly`.
- `ArgumentGraph` receives `propositions`, `relations`, `selectedId`, `onSelect`.

- [ ] **Step 1: Write failing numbering and workspace tests**

```ts
it('renumbers by source order after deletion', () => {
  const result = renumberPropositions([{ ...p2, number: 9 }, { ...p1, number: 4 }]);
  expect(result.map(p => p.number)).toEqual([1, 2]);
});
```

Also test that selecting text creates a proposition with `[start, end)`, selecting a proposition highlights its source text, and a submitted version renders read-only controls.

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- --run src/domain/numbering.test.ts src/components/annotation-workspace.test.tsx`
Expected: FAIL because the numbering helper and workspace do not exist.

- [ ] **Step 3: Implement the three-column workspace**

Render the actual Chinese reasoning sample. Use selection offsets to create propositions, show full proposition text, provide label selectors with the guide labels, and dispatch reducer actions for delete/recreate, undo/redo, and submit. Use an SVG graph with rectangular proposition nodes and relation nodes: solid circle for S, hollow circle for A, plus circle for J/M, and slash grouping for I. Keep graph selection synchronized with the proposition list.

- [ ] **Step 4: Run tests and build**

Run: `npm test -- --run src/domain/numbering.test.ts src/components/annotation-workspace.test.tsx` and `npm run build`.
Expected: all selected tests PASS and Vite build exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components src/domain/numbering.ts src/styles.css
git commit -m "feat: add synchronized annotation workspace"
```

## Task 5: Build adjudication, export, and final verification

**Files:**
- Create: `src/components/AdjudicationView.tsx`
- Create: `src/components/ExportView.tsx`
- Create: `src/domain/exporters.ts`
- Test: `src/domain/exporters.test.ts`
- Test: `src/components/adjudication-export.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `serializeJson(finalVersion, task): string` returns stable JSON with guide version, proposition indices, labels, and relations.
- `buildExportRecord(format, filename, userId): ExportRecord`.
- `AdjudicationView` allows choosing a source version or entering a final edit.
- `ExportView` is read-only after task stage becomes `exported`.

- [ ] **Step 1: Write failing export and adjudication tests**

Test that adjudication can adopt a selected annotator version, JSON includes `[start, end)` indices and guide version, and export records show format, filename, user, time, and status.

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test -- --run src/domain/exporters.test.ts src/components/adjudication-export.test.tsx`
Expected: FAIL because the views and serializer do not exist.

- [ ] **Step 3: Implement adjudication and export**

Show original text beside annotator columns, keep the first version visible even when it is the only version, and offer “采用此版本” plus direct editing. Render export format buttons with a short simulated progress state, then append an `ExportRecord` and show a download history table. Use browser downloads for JSON/CSV-like mock content and provide image buttons that show a completed state.

- [ ] **Step 4: Run the complete verification suite**

Run: `npm test -- --run` and `npm run build`.
Expected: all tests PASS, build exits 0, no TypeScript errors.

- [ ] **Step 5: Run the app for a manual smoke check**

Run: `npm run dev -- --host 127.0.0.1`.
Verify in the browser: overview → task detail → annotation workspace → adjudication → export, including a read-only final state and a visible download record.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: complete adjudication and export prototype"
```

## Self-review checklist

- [ ] Every confirmed spec section maps to at least one task above.
- [ ] No task relies on a placeholder or an undefined interface.
- [ ] Domain tests cover forward-only stages, labels, relation constraints, numbering, and export shape.
- [ ] Build and test commands are explicit and run before completion claims.
