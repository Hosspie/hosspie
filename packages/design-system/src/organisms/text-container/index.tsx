import { H2 } from '../../components/text';
import { Text } from '../../components/text';
import { YStack } from '../../components/stacks';

interface TextContainerProps {
  title?: string;
  description?: string;
  align?: 'start' | 'center' | 'end';
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
} as const;

const TextContainer = ({ title, description, align = 'start' }: TextContainerProps) => {
  return (
    <YStack gap="$4" padding="$3" alignItems={alignMap[align]}>
      {title && <H2>{title}</H2>}
      {description && <Text fontSize="$3">{description}</Text>}
    </YStack>
  );
};

export { TextContainer };
