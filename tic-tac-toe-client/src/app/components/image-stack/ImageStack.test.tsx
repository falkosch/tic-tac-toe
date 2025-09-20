import { render } from '@testing-library/react';
import React from 'react';

import { ImageStack, type ImageWithAlt } from './ImageStack';

describe(ImageStack.name, () => {
  let images: readonly ImageWithAlt[];

  beforeEach(() => {
    images = [];
  });

  it('renders without crashing', () => {
    render(<ImageStack images={images} />);
  });
});
