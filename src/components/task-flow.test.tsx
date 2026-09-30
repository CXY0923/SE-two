import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaskOverview } from './TaskOverview';
import { initialStore } from '../domain/mockData';

describe('task flow views', () => {
  it('renders the seeded task and guide version', () => {
    render(<TaskOverview state={initialStore} onNavigate={() => undefined} />);
    expect(screen.getByText('劳务合同纠纷论证结构试标')).toBeInTheDocument();
    expect(screen.getAllByText('v1.1').length).toBeGreaterThan(0);
  });
});
