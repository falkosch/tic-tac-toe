import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ImageStack, type ImageWithAlt } from './ImageStack';

describe('ImageStack', () => {
  describe('when no images are provided', () => {
    it('renders an empty container', () => {
      const { container } = render(<ImageStack images={[]} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.children).toHaveLength(0);
    });
  });

  describe('when a single image is provided', () => {
    const givenImage: ImageWithAlt = {
      src: '/test-image.svg',
      alt: 'Test image description',
    };

    it('renders the image with correct src attribute', () => {
      render(<ImageStack images={[givenImage]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/test-image.svg');
    });

    it('renders the image with correct alt attribute', () => {
      render(<ImageStack images={[givenImage]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });

    it('renders the image with absolute positioning', () => {
      render(<ImageStack images={[givenImage]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveClass('absolute');
    });

    it('renders the image with full width', () => {
      render(<ImageStack images={[givenImage]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveClass('w-full');
    });
  });

  describe('when multiple images are provided', () => {
    const givenImages: ImageWithAlt[] = [
      { src: '/image-1.svg', alt: 'First image' },
      { src: '/image-2.svg', alt: 'Second image' },
      { src: '/image-3.svg', alt: 'Third image' },
    ];

    it('renders all images', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('renders each image with correct src attributes', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', '/image-1.svg');
      expect(images[1]).toHaveAttribute('src', '/image-2.svg');
      expect(images[2]).toHaveAttribute('src', '/image-3.svg');
    });

    it('renders each image with correct alt attributes', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'First image');
      expect(images[1]).toHaveAttribute('alt', 'Second image');
      expect(images[2]).toHaveAttribute('alt', 'Third image');
    });

    it('renders all images with absolute positioning', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      images.forEach((image) => {
        expect(image).toHaveClass('absolute');
      });
    });

    it('renders all images with full width', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      images.forEach((image) => {
        expect(image).toHaveClass('w-full');
      });
    });
  });

  describe('Container structure', () => {
    const givenImages: ImageWithAlt[] = [
      { src: '/x.svg', alt: 'X mark' },
      { src: '/winning-line.svg', alt: 'Winning line' },
    ];

    it('renders a container with relative positioning', () => {
      const { container } = render(<ImageStack images={givenImages} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('relative');
    });

    it('renders a container with full height', () => {
      const { container } = render(<ImageStack images={givenImages} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('h-full');
    });

    it('renders images as children of the container', () => {
      const { container } = render(<ImageStack images={givenImages} />);

      const wrapper = container.querySelector('.relative');
      expect(wrapper?.children).toHaveLength(2);
      expect(wrapper?.children[0]?.tagName).toBe('IMG');
      expect(wrapper?.children[1]?.tagName).toBe('IMG');
    });
  });

  describe('Image ordering', () => {
    const givenImages: ImageWithAlt[] = [
      { src: '/layer-1.svg', alt: 'Bottom layer' },
      { src: '/layer-2.svg', alt: 'Middle layer' },
      { src: '/layer-3.svg', alt: 'Top layer' },
    ];

    it('preserves the order of images in the array', () => {
      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'Bottom layer');
      expect(images[1]).toHaveAttribute('alt', 'Middle layer');
      expect(images[2]).toHaveAttribute('alt', 'Top layer');
    });

    it('maintains correct stacking order in DOM', () => {
      const { container } = render(<ImageStack images={givenImages} />);

      const wrapper = container.querySelector('.relative');
      const domImages = Array.from(wrapper?.children ?? []);
      expect(domImages[0]).toHaveAttribute('src', '/layer-1.svg');
      expect(domImages[1]).toHaveAttribute('src', '/layer-2.svg');
      expect(domImages[2]).toHaveAttribute('src', '/layer-3.svg');
    });
  });

  describe('Edge cases', () => {
    it('handles images with empty alt text', () => {
      const givenImages: ImageWithAlt[] = [{ src: '/decorative.svg', alt: '' }];

      const { container } = render(<ImageStack images={givenImages} />);

      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', '');
      expect(image).toHaveAttribute('src', '/decorative.svg');
    });

    it('handles images with special characters in src', () => {
      const givenImages: ImageWithAlt[] = [
        { src: '/images/special%20chars%20&%20symbols.svg', alt: 'Special image' },
      ];

      render(<ImageStack images={givenImages} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/special%20chars%20&%20symbols.svg');
    });

    it('handles images with special characters in alt text', () => {
      const givenImages: ImageWithAlt[] = [
        { src: '/emoji.svg', alt: 'X & O player marks! #1' },
      ];

      render(<ImageStack images={givenImages} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'X & O player marks! #1');
    });

    it('handles a large number of images', () => {
      const givenImages: ImageWithAlt[] = Array.from({ length: 10 }, (_, index) => ({
        src: `/image-${String(index)}.svg`,
        alt: `Image ${String(index)}`,
      }));

      render(<ImageStack images={givenImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(10);
    });
  });
});
