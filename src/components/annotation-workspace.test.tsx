import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnnotationWorkspace } from './AnnotationWorkspace';
import { initialStore } from '../domain/mockData';

describe('annotation workspace', () => {
  it('shows the three annotation columns and proposition text', () => {
    render(<AnnotationWorkspace state={initialStore} versionId="version-a" readOnly onDispatch={() => undefined} />);
    expect(screen.getByText('裁判理由原文')).toBeInTheDocument();
    expect(screen.getByText('命题属性')).toBeInTheDocument();
    expect(screen.getByText('论证图示')).toBeInTheDocument();
    expect(screen.getAllByText('依法成立的合同，自成立时生效。').length).toBeGreaterThan(0);
  });
});
