import { ChevronDownIcon, ChevronUpIcon, CircleAlert } from 'lucide-react-native';
import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  AccordionContentText,
} from '../../components/accordion';
import { Badge, BadgeIcon, BadgeText, IBadgeIconProps, IBadgeProps } from '../../components/badge';
import { Card } from '../../components/card';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../../components/form-control';
import { HStack } from '../../components/h-stack';
import { Heading } from '../../components/header';
import { Input, InputField } from '../../components/input';
import { Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel } from '../../components/radio';
import { Text } from '../../components/text';
import { Textarea, TextareaInput } from '../../components/text-area';
import { VStack } from '../../components/v-stack';

export type FormFieldType = 'input' | 'textarea' | 'card' | 'radio';

type BaseFormField<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  description?: string;
  placeholder?: string;
  required?: boolean;
  rules?: {
    required?: string | boolean;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => boolean | string;
  };
};

export type FormField<T extends FieldValues = FieldValues> =
  | (BaseFormField<T> & {
      type: 'input' | 'textarea';
    })
  | (BaseFormField<T> & {
      type: 'card';
      options: {
        value: T[keyof T];
        label: string;
        description?: string;
        badges?: (IBadgeProps & { icon?: IBadgeIconProps['as']; label?: string })[];
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
  | (BaseFormField<T> & {
      type: 'radio';
      options: {
        value: T[keyof T];
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

export interface FormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  title?: string;
  fields: FormField<T>[];
}

export function FormFieldsOrganism<T extends FieldValues>({
  control,
  title,
  fields,
}: FormFieldsProps<T>) {
  return (
    <VStack className="w-full p-3" space="lg">
      {title && <Heading size="xl">{title}</Heading>}
      {fields.map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name as Path<T>}
          rules={field.rules}
          render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
            <FormControl isInvalid={!!error} isRequired={field.required}>
              <FormControlLabel>
                {field.description && (
                  <FormControlLabelText>{field.description}</FormControlLabelText>
                )}
              </FormControlLabel>
              {field.type === 'input' && (
                <Input>
                  <InputField
                    placeholder={field.placeholder}
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
              {field.type === 'textarea' && (
                <Textarea size="md">
                  <TextareaInput
                    placeholder={field.placeholder}
                    value={value}
                    onChangeText={onChange}
                  />
                </Textarea>
              )}
              {field.type === 'card' && (
                <VStack space="xl">
                  {field.options.map((option, index) => (
                    <Card key={index} variant="outline">
                      <VStack space="md">
                        <VStack space="xs" className="relative">
                          {/* Right checkbox - fixed to top right */}
                          <RadioGroup
                            className="absolute right-0 top-0"
                            value={value as string}
                            onChange={onChange}
                          >
                            <Radio value={option.value as string}>
                              <RadioIndicator>
                                <RadioIcon />
                              </RadioIndicator>
                            </Radio>
                          </RadioGroup>

                          {/* Left content with right margin to avoid overlap */}
                          <VStack space="xs" className="pr-8">
                            <HStack space="sm">
                              <Heading size="lg">{option.label}</Heading>
                              {option.badges && (
                                <HStack space="xs">
                                  {option.badges.map((badge, badgeIndex) => (
                                    <Badge
                                      key={badgeIndex}
                                      action={badge.action || 'success'}
                                      variant="solid"
                                      size="sm"
                                    >
                                      <BadgeText>{badge.label}</BadgeText>
                                      {badge.icon && <BadgeIcon as={badge.icon} className="ml-2" />}
                                    </Badge>
                                  ))}
                                </HStack>
                              )}
                            </HStack>
                            {option.description && <Text size="sm">{option.description}</Text>}
                          </VStack>
                        </VStack>

                        {/* Expandable section */}
                        {option.expandable && (
                          <Accordion variant="unfilled" className="bg-secondary-0" type="single">
                            <AccordionItem value={`item-${index}`}>
                              <AccordionHeader>
                                <AccordionTrigger>
                                  {({ isExpanded }) => (
                                    <HStack>
                                      <AccordionTitleText>
                                        {option.expandable.label}
                                      </AccordionTitleText>
                                      <AccordionIcon
                                        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                                      />
                                    </HStack>
                                  )}
                                </AccordionTrigger>
                              </AccordionHeader>
                              <AccordionContent>
                                {option.expandable.type === 'input' && (
                                  <FormControl>
                                    <Input>
                                      <InputField
                                        placeholder={option.expandable.placeholder}
                                        value={option.expandable.value}
                                        onChangeText={option.expandable.onChange}
                                      />
                                    </Input>
                                  </FormControl>
                                )}
                                {option.expandable.type === 'text' && (
                                  <AccordionContentText>
                                    {option.expandable.content}
                                  </AccordionContentText>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </VStack>
                    </Card>
                  ))}
                </VStack>
              )}
              {field.type === 'radio' && (
                <VStack space="md">
                  <RadioGroup value={value as string} onChange={onChange}>
                    <VStack space={field.direction === 'horizontal' ? 'xs' : 'sm'}>
                      {field.direction === 'horizontal' ? (
                        <HStack space="lg">
                          {field.options.map((option, index) => (
                            <Radio key={index} value={option.value as string}>
                              <RadioIndicator>
                                <RadioIcon />
                              </RadioIndicator>
                              <RadioLabel>{option.label}</RadioLabel>
                            </Radio>
                          ))}
                        </HStack>
                      ) : (
                        field.options.map((option, index) => (
                          <Radio key={index} value={option.value as string}>
                            <RadioIndicator>
                              <RadioIcon />
                            </RadioIndicator>
                            <RadioLabel>{option.label}</RadioLabel>
                          </Radio>
                        ))
                      )}
                    </VStack>
                  </RadioGroup>

                  {/* Expandable sections for selected options */}
                  {field.options.map(
                    (option, index) =>
                      option.expandable &&
                      value === option.value && (
                        <VStack key={`expandable-${index}`} space="xs">
                          {option.expandable.type === 'input' && (
                            <FormControl>
                              <Input>
                                <InputField
                                  placeholder={option.expandable.placeholder}
                                  value={option.expandable.value}
                                  onChangeText={option.expandable.onChange}
                                />
                              </Input>
                            </FormControl>
                          )}
                          {option.expandable.type === 'text' && (
                            <Text size="sm">{option.expandable.content}</Text>
                          )}
                        </VStack>
                      )
                  )}
                </VStack>
              )}
              <FormControlError>
                <FormControlErrorIcon as={CircleAlert} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                  {error?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      ))}
    </VStack>
  );
}
