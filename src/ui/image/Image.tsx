import React, { forwardRef } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: React.ReactNode;
  figureClassName?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ caption, className = '', figureClassName = '', alt, ...rest }, ref) => {
    const imgClasses = ['img--responsive', className].filter(Boolean).join(' ');
    if (caption === undefined) {
      return <img ref={ref} alt={alt} className={imgClasses} {...rest} />;
    }
    return (
      <figure
        className={['img-figure', figureClassName].filter(Boolean).join(' ')}
      >
        <img ref={ref} alt={alt} className={imgClasses} {...rest} />
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }
);
Image.displayName = 'Image';
