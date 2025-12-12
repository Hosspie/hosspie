import { Box } from '@hosspie/design-system/components/box';
import { IButtonProps, Buttons } from '@hosspie/design-system/organisms/buttons';
import { FormFieldOrganism } from '@hosspie/design-system/organisms/form-field';
import { TextContainer } from '@hosspie/design-system/organisms/text-container';
import { Field, useForm } from '@hosspie/services/form';
import { router, Stack } from 'expo-router';

import { IOnboardingFormData } from '../_layout';

export default function OnboardingDescriptionScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  console.log('OnboardingDescriptionScreen');

  const handlePressNext = handleSubmit(
    (data) => {
      console.log('Form data:', data);
      router.push('/onboarding/information');
    },
    (errors) => {
      console.log('error', errors);
    }
  );

  const buttons: IButtonProps[] = [
    {
      text: '다음 단계',
      onPress: handlePressNext,
      variant: 'solid',
      action: 'primary',
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`게스트하우스 정보를\n등록해 주세요`}
        description="기본적인 정보부터 시작해보겠습니다"
      />

      <Field<IOnboardingFormData, 'name'>
        name="name"
        rules={{
          required: '게스트하우스 이름을 입력해주세요',
          minLength: {
            value: 2,
            message: '게스트하우스 이름은 최소 2자 이상 입력해주세요',
          },
          maxLength: {
            value: 50,
            message: '게스트하우스 이름은 50자 이내로 입력해주세요',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="input"
            title="게스트하우스 이름"
            placeholder="예: 홍대 게스트하우스"
            value={value}
            onChange={onChange}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
          />
        )}
      />

      <Field<IOnboardingFormData, 'description'>
        name="description"
        rules={{
          required: '게스트하우스에 대한 설명을 입력해주세요',
          minLength: {
            value: 10,
            message: '게스트하우스에 대한 설명은 최소 10자 이상 입력해주세요',
          },
          maxLength: {
            value: 50,
            message: '게스트하우스에 대한 설명은 200자 이내로 입력해주세요',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="textarea"
            title="게스트하우스에 대한 설명을 적어주세요"
            placeholder="ex. 안락한 소규모 게스트하우스입니다."
            value={value}
            onChange={onChange}
            error={error && { message: error.message }}
            isRequired={isRequired}
          />
        )}
      />

      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
