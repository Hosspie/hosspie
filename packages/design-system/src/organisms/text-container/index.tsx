import { Heading } from '../../components/header';
import { Text } from '../../components/text';
import { VStack } from '../../components/v-stack';

interface TextContainerProps {
  title?: string;
  description?: string;
  align?: 'start' | 'center' | 'end';
}

const TextContainer = ({ title, description, align = 'start' }: TextContainerProps) => {
  return (
    <VStack space="md" className={`p-3 items-${align}`}>
      {title && <Heading size="2xl">{title}</Heading>}
      {description && <Text size="md">{description}</Text>}
    </VStack>
  );
};

export { TextContainer };
