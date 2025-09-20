import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { ImageStack, type ImageWithAlt } from './ImageStack';

describe('ImageStack', () => {
  let images: readonly ImageWithAlt[];

  beforeEach(() => {
    images = [];
  });

  it('renders without crashing', () => {
    render(<ImageStack images={images} />);
  });
});
