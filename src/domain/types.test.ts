import { describe, expect, it } from 'vitest';
import { initialStore } from './mockData';

describe('mock annotation scenario', () => {
  it('contains two submitted versions and a nested relation', () => {
    const versions = Object.values(initialStore.annotationVersions);
    expect(versions.filter((version) => version.status === 'submitted')).toHaveLength(2);
    expect(versions.some((version) => version.relations.some((relation) => relation.nested?.length))).toBe(true);
  });
});
