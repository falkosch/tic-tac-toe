import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { HumanPlayerStatusView } from './HumanPlayerStatusView';

describe('HumanPlayerStatusView', () => {
  it('renders without crashing', () => {
    render(<HumanPlayerStatusView />);
  });
});
