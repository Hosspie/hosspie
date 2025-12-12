'use client';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { Image as ExpoImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import React from 'react';

cssInterop(ExpoImage, { className: 'style' });

const imageStyle = tva({
  base: 'max-w-full',
  variants: {
    size: {
      '2xs': 'h-6 w-6',
      xs: 'h-10 w-10',
      sm: 'h-16 w-16',
      md: 'h-20 w-20',
      lg: 'h-24 w-24',
      xl: 'h-32 w-32',
      '2xl': 'h-64 w-64',
      full: 'h-full w-full',
      none: '',
    },
  },
});

type ImageProps = VariantProps<typeof imageStyle> & React.ComponentProps<typeof ExpoImage>;
const Image = React.forwardRef<
  React.ComponentRef<typeof ExpoImage>,
  ImageProps & { className?: string }
>(function Image({ size = 'md', className, source, ...props }, ref) {
  return (
    <ExpoImage
      ref={ref}
      className={imageStyle({ size, class: className })}
      source={source}
      contentFit="contain"
      {...props}
    />
  );
});

Image.displayName = 'Image';
export { Image };
