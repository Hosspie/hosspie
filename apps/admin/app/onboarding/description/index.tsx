import { ButtonGroup, ButtonGroupItemProps } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';
import { ScrollArea } from '@hosspie/design-system/organisms/scroll-area';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { Field, useForm } from '@hosspie/services/form';
import { router } from 'expo-router';

import { IOnboardingFormData } from '../_layout';

export default function OnboardingDescriptionScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  const handlePressNext = handleSubmit(
    () => {
      router.push('/onboarding/information');
    },
    () => {
      // 유효성 검사 실패 시 폼이 에러 표시 처리
    }
  );

  const buttons: ButtonGroupItemProps[] = [
    {
      text: '다음 단계',
      onPress: handlePressNext,
      variant: 'primary',
    },
  ];

  return (
    <ScrollArea>
      <TextBlock
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
          <FormField
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
          <FormField
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

      <ButtonGroup placement="bottom" direction="vertical" buttons={buttons} />
    </ScrollArea>
  );
}
