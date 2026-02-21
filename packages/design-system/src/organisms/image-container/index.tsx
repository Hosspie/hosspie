import { type FC } from 'react';
import { type SvgProps } from 'react-native-svg';

import { Image } from '../../components/image';
import { YStack } from '../../components/stacks';

type SizeKey = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';

interface ImageContainerProps {
  src: string | FC<SvgProps>;
  alt?: string;
  size?: SizeKey;
  align?: 'start' | 'center' | 'end';
}

const sizeMap: Record<SizeKey, number | string> = {
  '2xs': 24,
  xs: 40,
  sm: 64,
  md: 80,
  lg: 96,
  xl: 128,
  '2xl': 256,
  full: '100%',
  none: 128,
};

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
} as const;

const ImageContainer = ({
  src,
  alt = 'image',
  size = 'md',
  align = 'center',
}: ImageContainerProps) => {
  const isSvgComponent = typeof src === 'function';

  if (isSvgComponent) {
    const SvgComponent = src as FC<SvgProps>;
    const svgSize = sizeMap[size] || 80;

    return (
      <YStack width="100%" alignItems={alignMap[align]}>
        <SvgComponent width={svgSize as number} height={svgSize as number} />
      </YStack>
    );
  }

  const imgSize = sizeMap[size] || 80;

  return (
    <YStack width="100%" alignItems={alignMap[align]}>
      <Image
        source={{ uri: src as string }}
        width={imgSize as number}
        height={imgSize as number}
        alt={alt}
      />
    </YStack>
  );
};

export { ImageContainer };
