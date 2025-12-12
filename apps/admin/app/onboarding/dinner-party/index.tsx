import { Box } from '@hosspie/design-system/components/box';
import { IButtonProps, Buttons } from '@hosspie/design-system/organisms/buttons';
import { FormFieldOrganism } from '@hosspie/design-system/organisms/form-field';
import { TextContainer } from '@hosspie/design-system/organisms/text-container';
import { Field, useForm } from '@hosspie/services/form';
import { router } from 'expo-router';

import { IOnboardingFormData } from '../_layout';

export default function OnboardingDinnerPartyScreen() {
  console.log('OnboardingDinnerPartyScreen');

  const { handleSubmit } = useForm<IOnboardingFormData>();

  const handlePressNext = handleSubmit(
    (data) => {
      console.log('Form data:', data);
      router.push('/onboarding/rooms');
    },
    (errors) => {
      console.log('error', errors);
    }
  );

  const handlePressBack = () => {
    router.back();
  };

  const buttons: IButtonProps[] = [
    {
      text: '이전',
      variant: 'outline',
      action: 'secondary',
      onPress: handlePressBack,
    },
    {
      text: '다음 단계',
      variant: 'solid',
      action: 'primary',
      onPress: handlePressNext,
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`저녁 파티 방식을\n선택해 주세요`}
        description="게스트들과 함께하는 특별한 시간을 만들어보세요"
      />
      <Field<IOnboardingFormData, 'dinnerParty'>
        name="dinnerParty"
        rules={{ required: '저녁 파티 방식을 선택해주세요' }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => {
          return (
            <FormFieldOrganism
              type="card"
              title="저녁 파티 방식을 선택해 주세요"
              value={value}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
              options={[
                {
                  value: { type: 'POT_LUCK' },
                  label: '포틀럭 파티',
                  description: '게스트들이 자유롭게 참여하는 파티',
                },
                {
                  value: { type: 'HOST_SERVED' },
                  label: '호스트 제공',
                  description: '호스트가 제공하는 식사',
                },
                {
                  value: { type: 'CUSTOM' },
                  label: '기타',
                  description: '직접 입력하여 커스텀 파티를 만들어보세요',
                  expandable: {
                    type: 'input',
                    label: '펼치기',
                    placeholder: '예: 바비큐 파티, 와인 테이스팅 등',
                    value: value?.description || '',
                    onChange: (description) => {
                      onChange({
                        ...value,
                        description,
                      });
                    },
                  },
                },
              ]}
            />
          );
        }}
      />
      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
