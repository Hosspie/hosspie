import { Link } from 'expo-router';
import { Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <Link href="/">
      <Text>Not Found</Text>
    </Link>
  );
}
