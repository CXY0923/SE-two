import type { AnnotationVersion, ExportRecord, Task } from './types';

export function serializeJson(version: AnnotationVersion, task: Task): string {
  return JSON.stringify({ guideVersion: task.guideVersion, documentId: version.documentId, annotatorId: version.annotatorId, propositions: version.propositions.map((item) => ({ ...item, charRange: { start: item.start, end: item.end } })), relations: version.relations }, null, 2);
}

export function buildExportRecord(format: ExportRecord['format'], filename: string, userId: string): ExportRecord {
  return { id: `export-${Date.now()}`, format, filename, userId, guideVersion: 'v1.1', status: 'completed', createdAt: new Date().toISOString() };
}
