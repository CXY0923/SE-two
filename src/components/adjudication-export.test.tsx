import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdjudicationView } from './AdjudicationView';
import { initialStore } from '../domain/mockData';

describe('adjudication and export views', () => {
  it('shows both annotator versions and direct adjudication action', () => {
    render(<AdjudicationView state={initialStore} onAdjudicate={() => undefined} onNavigate={() => undefined} />);
    expect(screen.getByText('张同学')).toBeInTheDocument();
    expect(screen.getByText('李同学')).toBeInTheDocument();
    expect(screen.getAllByText('采用此版本').length).toBe(2);
  });
});
