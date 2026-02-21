import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { TextArea, View } from 'tamagui';

import { Accordion } from '../../components/accordion';
import { Badge, BadgeText } from '../../components/badge';
import { Card } from '../../components/card';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { RadioGroup } from '../../components/radio';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

export type FormFieldType = 'input' | 'textarea' | 'card' | 'radio';

type BaseFormField = {
  title?: string;
  placeholder?: string;
  isRequired?: boolean;
  error?: { message: string };
};

export type IFormField<T> =
  | (BaseFormField & {
      type: 'input' | 'textarea';
      value?: string;
      onChange: (value: string) => void;
    })
  | (BaseFormField & {
      type: 'card';
      value: T;
      onChange: (value: T) => void;
      options: {
        value: T;
        label: string;
        description?: string;
        badges?: {
          variant?: 'success' | 'error' | 'warning' | 'info';
          label?: string;
        }[];
        expandable?:
          | { type: 'text'; label: string; content: string }
          | {
              type: 'input';
              label: string;
              placeholder: string;
              value?: string;
              onChange: (value: string) => void;
            };
      }[];
    })
  | (BaseFormField & {
      type: 'radio';
      value: T;
      onChange: (value: T) => void;
      options: {
        value: T;
        label: string;
        expandable?:
          | { type: 'text'; label: string; content: string }
          | {
              type: 'input';
              label: string;
              placeholder: string;
              value?: string;
              onChange: (value: string) => void;
            };
      }[];
      direction: 'horizontal' | 'vertical';
    });

function ErrorMessage({ message }: { message: string }) {
  return (
    <XStack gap="$2" alignItems="center" marginTop="$2">
      <AlertCircle size={16} color="#EF4444" />
      <Text color="$error" fontSize="$1">{message}</Text>
    </XStack>
  );
}

function ExpandableSection({
  expandable,
  index,
}: {
  expandable: {
    type: 'text' | 'input';
    label: string;
    content?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  };
  index: number;
}) {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item value={`item-${index}`}>
        <Accordion.Header>
          <Accordion.Trigger
            flexDirection="row"
            justifyContent="space-between"
            backgroundColor="$surfaceCard"
            padding="$3"
            borderRadius="$2"
          >
            {({ open }: { open: boolean }) => (
              <XStack flex={1} justifyContent="space-between" alignItems="center">
                <Text>{expandable.label}</Text>
                {open ? (
                  <ChevronUp size={16} color="#B8B8C8" />
                ) : (
                  <ChevronDown size={16} color="#B8B8C8" />
                )}
              </XStack>
            )}
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content padding="$3">
          {expandable.type === 'input' && expandable.onChange && (
            <Input
              placeholder={expandable.placeholder}
              value={expandable.value}
              onChangeText={expandable.onChange}
            />
          )}
          {expandable.type === 'text' && (
            <Text color="$textSecondary">{expandable.content}</Text>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export function FormFieldOrganism<T>(props: IFormField<T>) {
  if (props.type === 'input') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <YStack padding="$3" gap="$2">
        {title && (
          <Label fontSize="$4">
            {title}{isRequired && ' *'}
          </Label>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          borderColor={error ? '$error' : '$borderNormal'}
        />
        {error && <ErrorMessage message={error.message} />}
      </YStack>
    );
  }

  if (props.type === 'textarea') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <YStack width="100%" padding="$3" gap="$6">
        {title && <H3>{title}</H3>}
        <YStack gap="$2">
          {title && (
            <Label>
              {title}{isRequired && ' *'}
            </Label>
          )}
          <TextArea
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            borderColor={error ? '$error' : '$borderNormal'}
          />
          {error && <ErrorMessage message={error.message} />}
        </YStack>
      </YStack>
    );
  }

  if (props.type === 'card') {
    const { value, onChange, title, isRequired, error, options } = props;
    return (
      <YStack width="100%" padding="$3" gap="$6">
        {title && <H3>{title}</H3>}
        <YStack gap="$2">
          {title && (
            <Label>
              {title}{isRequired && ' *'}
            </Label>
          )}
          <RadioGroup
            value={(value ?? '') as string}
            onValueChange={(val) => onChange(val as T)}
          >
            <YStack gap="$6">
              {options.map((option, index) => (
                <Card key={index} bordered padding="$4">
                  <YStack gap="$4">
                    <YStack gap="$1" position="relative">
                      <View position="absolute" right={0} top={0} zIndex={1}>
                        <RadioGroup.Item
                          value={option.value as string}
                          id={`card-radio-${index}`}
                        >
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                      </View>

                      <YStack gap="$1" paddingRight="$8">
                        <XStack gap="$2" alignItems="center">
                          <H3>{option.label}</H3>
                          {option.badges && (
                            <XStack gap="$1">
                              {option.badges.map((badge, badgeIndex) => (
                                <Badge
                                  key={badgeIndex}
                                  variant={badge.variant || 'success'}
                                >
                                  <BadgeText>{badge.label}</BadgeText>
                                </Badge>
                              ))}
                            </XStack>
                          )}
                        </XStack>
                        {option.description && (
                          <Text fontSize="$1" color="$textSecondary">
                            {option.description}
                          </Text>
                        )}
                      </YStack>
                    </YStack>

                    {option.expandable && (
                      <ExpandableSection expandable={option.expandable} index={index} />
                    )}
                  </YStack>
                </Card>
              ))}
            </YStack>
          </RadioGroup>
          {error && <ErrorMessage message={error.message} />}
        </YStack>
      </YStack>
    );
  }

  if (props.type === 'radio') {
    const { value, onChange, title, isRequired, error, options, direction } = props;
    return (
      <YStack width="100%" padding="$3" gap="$6">
        {title && <H3>{title}</H3>}
        <YStack gap="$2">
          {title && (
            <Label>
              {title}{isRequired && ' *'}
            </Label>
          )}
          <YStack gap="$4">
            <RadioGroup
              value={(value ?? '') as string}
              onValueChange={(val) => onChange(val as T)}
            >
              {direction === 'horizontal' ? (
                <XStack gap="$6">
                  {options.map((option, index) => (
                    <XStack key={index} gap="$2" alignItems="center">
                      <RadioGroup.Item
                        value={option.value as string}
                        id={`radio-${index}`}
                      >
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor={`radio-${index}`}>{option.label}</Label>
                    </XStack>
                  ))}
                </XStack>
              ) : (
                <YStack gap="$2">
                  {options.map((option, index) => (
                    <XStack key={index} gap="$2" alignItems="center">
                      <RadioGroup.Item
                        value={option.value as string}
                        id={`radio-${index}`}
                      >
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor={`radio-${index}`}>{option.label}</Label>
                    </XStack>
                  ))}
                </YStack>
              )}
            </RadioGroup>

            {options.map(
              (option, index) =>
                option.expandable &&
                value === option.value && (
                  <YStack key={`expandable-${index}`} gap="$1">
                    {option.expandable.type === 'input' && option.expandable.onChange && (
                      <Input
                        placeholder={option.expandable.placeholder}
                        value={option.expandable.value}
                        onChangeText={option.expandable.onChange}
                      />
                    )}
                    {option.expandable.type === 'text' && (
                      <Text fontSize="$1" color="$textSecondary">
                        {option.expandable.content}
                      </Text>
                    )}
                  </YStack>
                )
            )}
          </YStack>
          {error && <ErrorMessage message={error.message} />}
        </YStack>
      </YStack>
    );
  }
}
