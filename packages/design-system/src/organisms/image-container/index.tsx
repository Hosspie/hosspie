import { FC } from 'react';
import { View, Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface ImageContainerProps {
  src: ImageSourcePropType | FC<SvgProps>;
  alt?: string;
  size?: number;
  align?: 'start' | 'center' | 'end';
}

const alignMap = {
  start: 'flex-start' as const,
  center: 'center' as const,
  end: 'flex-end' as const,
};

const ImageContainer = ({
  src,
  alt = 'image',
  size = 80,
  align = 'center',
}: ImageContainerProps) => {
  const alignItems = alignMap[align];
  const isSvgComponent = typeof src === 'function';

  if (isSvgComponent) {
    const SvgComponent = src as FC<SvgProps>;
    return (
      <View style={[styles.container, { alignItems }]}>
        <SvgComponent width={size} height={size} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { alignItems }]}>
      <Image
        source={src as ImageSourcePropType}
        style={{ width: size, height: size }}
        accessibilityLabel={alt}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export { ImageContainer };
