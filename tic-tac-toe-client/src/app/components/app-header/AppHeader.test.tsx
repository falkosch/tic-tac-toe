import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { AppHeader } from './AppHeader.tsx';

describe('AppHeader', () => {
  it('renders without crashing', () => {
    render(<AppHeader />);
  });
});
