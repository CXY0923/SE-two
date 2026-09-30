import { describe, expect, it } from 'vitest';
import { initialStore } from './mockData';
import { serializeJson, buildExportRecord } from './exporters';

describe('export serializers', () => {
  it('includes guide version and half-open indices in JSON', () => {
    const version = initialStore.annotationVersions['version-a'];
    const result = JSON.parse(serializeJson(version, initialStore.tasks['task-1']));
    expect(result.guideVersion).toBe('v1.1');
    expect(result.propositions[0].charRange).toEqual({ start: 0, end: 15 });
  });
  it('creates a completed export record', () => {
    const record = buildExportRecord('JSON', 'result.json', 'u-owner');
    expect(record.status).toBe('completed');
    expect(record.filename).toBe('result.json');
  });
});
