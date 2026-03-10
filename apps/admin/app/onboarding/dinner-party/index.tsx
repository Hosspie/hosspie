import { ButtonGroup, ButtonGroupItemProps } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';
import { ScrollArea } from '@hosspie/design-system/organisms/scroll-area';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { Field, useForm } from '@hosspie/services/form';
import { DinnerPartyType } from '@hosspie/types';
import { router } from 'expo-router';

import { IOnboardingFormData } from '../_layout';

export default function OnboardingDinnerPartyScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  const handlePressNext = handleSubmit(
    () => {
      router.push('/onboarding/rooms');
    },
    () => {
      // 유효성 검사 실패 시 폼이 에러 표시 처리
    }
  );

  const handlePressBack = () => {
    router.back();
  };

  const buttons: ButtonGroupItemProps[] = [
    {
      text: '이전',
      variant: 'outline',
      onPress: handlePressBack,
    },
    {
      text: '다음 단계',
      variant: 'primary',
      onPress: handlePressNext,
    },
  ];

  return (
    <ScrollArea>
      <TextBlock
        title={`저녁 파티 방식을\n선택해 주세요`}
        description="게스트들과 함께하는 특별한 시간을 만들어보세요"
      />
      <Field<IOnboardingFormData, 'dinnerParty'>
        name="dinnerParty"
        rules={{ required: '저녁 파티 방식을 선택해주세요' }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => {
          return (
            <FormField
              type="card"
              title="저녁 파티 방식을 선택해 주세요"
              value={value}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
              options={[
                {
                  value: { type: DinnerPartyType.POT_LUCK },
                  label: '포틀럭 파티',
                  description: '게스트들이 자유롭게 참여하는 파티',
                },
                {
                  value: { type: DinnerPartyType.HOST_SERVED },
                  label: '호스트 제공',
                  description: '호스트가 제공하는 식사',
                },
                {
                  value: { type: DinnerPartyType.CUSTOM },
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
      <ButtonGroup placement="bottom" direction="vertical" buttons={buttons} />
    </ScrollArea>
  );
}
