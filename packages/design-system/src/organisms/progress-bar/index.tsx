import { Progress, ProgressFilledTrack } from '../../components/progress';
import { Text } from '../../components/text';
import { VStack } from '../../components/v-stack';

interface ProgressBarProps {
  value: number;
  caption?: string;
}

const ProgressBar = ({ value, caption }: ProgressBarProps) => {
  return (
    <VStack space="md" className="p-3">
      <Progress value={value} size="md" orientation="horizontal">
        <ProgressFilledTrack />
      </Progress>
      {caption && <Text size="md">{caption}</Text>}
    </VStack>
  );
};

export { ProgressBar };
