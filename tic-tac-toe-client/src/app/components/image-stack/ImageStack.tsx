import React, { type FC } from 'react';

import styles from './ImageStack.module.css';

export interface ImageWithAlt {
  src: string;
  alt: string;
}

export const ImageStack: FC<{
  images: readonly ImageWithAlt[];
}> = ({ images }) => (
  <div className={`${styles.top} position-absolute h-100 w-100`}>
    {images.map((image, index) => {
      const strikeKey = `d${index}`;
      return (
        <img
          key={strikeKey}
          className={`${styles.top} d-block position-absolute h-100 w-100`}
          src={image.src}
          alt={image.alt}
        />
      );
    })}
  </div>
);
