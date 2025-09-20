import { render } from '@testing-library/react';
import React from 'react';
import { describe, it } from 'vitest';

import { Header } from './Header';

describe(Header.name, () => {
  it('renders without crashing', () => {
    render(<Header />);
  });
});
