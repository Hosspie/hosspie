import { Box } from '@hosspie/ui/components';
import { useState } from 'react';
import { Text } from 'react-native';

export default function UnauthenticatedScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', { email, password });
    } else {
      console.log('Sign up:', { email, password, confirmPassword });
    }
  };

  return (
    <Box className="bg-primary-100">
      <Text>{isLogin ? '로그인' : '회원가입'}</Text>
    </Box>
  );
}
