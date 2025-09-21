import { type FC } from 'react';

export interface ImageWithAlt {
  src: string;
  alt: string;
}

export const ImageStack: FC<{
  images: readonly ImageWithAlt[];
}> = ({ images }) => (
  <div className="relative h-full">
    {images.map((image, index) => (
      <img
        className="absolute w-full"
        key={`is${index.toFixed()}`}
        src={image.src}
        alt={image.alt}
      />
    ))}
  </div>
);
