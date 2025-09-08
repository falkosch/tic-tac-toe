import { render } from '@testing-library/react';
import React from 'react';

import { ImageStack, ImageWithAlt } from './ImageStack';

describe(`${ImageStack.name}`, () => {
  let images: ReadonlyArray<ImageWithAlt>;

  beforeEach(() => {
    images = [];
  });

  it('renders without crashing', () => {
    render(<ImageStack images={images} />);
  });
});
