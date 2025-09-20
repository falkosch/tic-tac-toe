import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { Header } from './Header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });
});
