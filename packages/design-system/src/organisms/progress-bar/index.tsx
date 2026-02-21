import { Progress } from '../../components/progress';
import { Text } from '../../components/text';
import { YStack } from '../../components/stacks';

interface ProgressBarProps {
  value: number;
  caption?: string;
}

const ProgressBar = ({ value, caption }: ProgressBarProps) => {
  return (
    <YStack gap="$4" padding="$3">
      <Progress value={value} size="$1">
        <Progress.Indicator
          animation="fast"
          backgroundColor="$brandPrimary"
        />
      </Progress>
      {caption && <Text fontSize="$3">{caption}</Text>}
    </YStack>
  );
};

export { ProgressBar };
