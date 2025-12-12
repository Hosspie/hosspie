import { ComponentProps, FC } from 'react';
import { SvgProps } from 'react-native-svg';

import { Box } from '../../components/box';
import { Image } from '../../components/image';

type ImageProps = ComponentProps<typeof Image>;

interface ImageContainerProps {
  src: string | FC<SvgProps>;
  alt?: string;
  size?: ImageProps['size'];
  align?: 'start' | 'center' | 'end';
}

const ImageContainer = ({
  src,
  alt = 'image',
  size = 'md',
  align = 'center',
}: ImageContainerProps) => {
  const isSvgComponent = typeof src === 'function';
  if (isSvgComponent) {
    const SvgComponent = src as FC<SvgProps>;

    const getSizeInPx = (size: ImageProps['size']) => {
      const sizeMap = {
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
      return sizeMap[size as keyof typeof sizeMap] || 80;
    };

    const svgSize = getSizeInPx(size);

    return (
      <Box className={`items-${align} w-full`}>
        <SvgComponent width={svgSize} height={svgSize} />
      </Box>
    );
  }

  return (
    <Box className={`items-${align} w-full`}>
      <Image size={size} source={src} alt={alt} />
    </Box>
  );
};

export { ImageContainer };
