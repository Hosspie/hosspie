import { ButtonGroup, type ButtonGroupItemProps } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { Field, useForm } from '@hosspie/services/form';
import { router } from 'expo-router';
import { View, ScrollView, StyleSheet } from 'react-native';

import { type IOnboardingFormData } from '../_layout';

export default function OnboardingInformationScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  const handleNext = handleSubmit(
    () => {
      router.push('/onboarding/dinner-party');
    },
    () => {
      // 유효성 검사 실패 시 폼이 에러 표시 처리
    }
  );

  const handleBack = () => {
    router.back();
  };

  const buttons: ButtonGroupItemProps[] = [
    {
      text: '이전',
      onPress: handleBack,
      variant: 'outline',
    },
    {
      text: '다음 단계',
      onPress: handleNext,
      variant: 'primary',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TextBlock
          title={`연락처 정보를\n입력해 주세요`}
          description="고객들이 쉽게 연락할 수 있도록 정보를 입력해주세요"
        />

        <Field<IOnboardingFormData, 'address'>
          name="address"
          rules={{
            required: '주소를 입력해주세요',
            minLength: {
              value: 5,
              message: '주소는 최소 5자 이상 입력해주세요',
            },
            maxLength: {
              value: 100,
              message: '주소는 100자 이내로 입력해주세요',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormField
              type="input"
              title="주소"
              placeholder="예: 서울시 마포구 홍대입구역 2번 출구"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
            />
          )}
        />

        <Field<IOnboardingFormData, 'phone'>
          name="phone"
          rules={{
            required: '연락처를 입력해주세요',
            pattern: {
              value: /^0\d{1,2}-\d{3,4}-\d{4}$/,
              message: '올바른 전화번호 형식을 입력해주세요 (예: 02-1234-5678)',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormField
              type="input"
              title="연락처"
              placeholder="예: 02-1234-5678"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
            />
          )}
        />

        <Field<IOnboardingFormData, 'email'>
          name="email"
          rules={{
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '올바른 이메일 형식을 입력해주세요',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormField
              type="input"
              title="이메일"
              placeholder="예: contact@guesthouse.com"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
            />
          )}
        />

        <Field<IOnboardingFormData, 'website'>
          name="website"
          rules={{
            pattern: {
              value: /^https?:\/\/.+\..+/,
              message: '올바른 웹사이트 URL을 입력해주세요 (http:// 또는 https:// 포함)',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormField
              type="input"
              title="웹사이트 (선택사항)"
              placeholder="예: https://guesthouse.com"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
            />
          )}
        />
      </ScrollView>

      <ButtonGroup placement="bottom" direction="vertical" buttons={buttons} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 8,
  },
});
