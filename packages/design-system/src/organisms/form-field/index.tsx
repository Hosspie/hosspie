import { AlertCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react-native';
import React from 'react';

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
import { Box } from '../../components/box';

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
        badges?: (IBadgeProps & {
          icon?: IBadgeIconProps['as'];
          label?: string;
        })[];
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

export function FormFieldOrganism<T>(props: IFormField<T>) {
  if (props.type === 'input') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <Box className="p-3">
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText size="2xl">{title}</FormControlLabelText>}
          </FormControlLabel>
          <Input>
            <InputField placeholder={placeholder} value={value} onChangeText={onChange} />
          </Input>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>
    );
  }
  if (props.type === 'textarea') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <VStack className="w-full p-3" space="lg">
        {title && <Heading size="xl">{title}</Heading>}
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText>{title}</FormControlLabelText>}
          </FormControlLabel>
          <Textarea size="md">
            <TextareaInput placeholder={placeholder} value={value} onChangeText={onChange} />
          </Textarea>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }
  if (props.type === 'card') {
    const { value, onChange, title, isRequired, error, options } = props;
    return (
      <VStack className="w-full p-3" space="lg">
        {title && <Heading size="xl">{title}</Heading>}
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText>{title}</FormControlLabelText>}
          </FormControlLabel>
          <VStack space="xl">
            {options.map((option, index) => (
              <Card key={index} variant="outline">
                <VStack space="md">
                  <VStack space="xs" className="relative">
                    {/* Right checkbox - fixed to top right */}
                    <RadioGroup
                      className="absolute right-0 top-0"
                      value={(value ?? '') as string}
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
                                <AccordionTitleText>{option.expandable.label}</AccordionTitleText>
                                <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
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
                            <AccordionContentText>{option.expandable.content}</AccordionContentText>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </VStack>
              </Card>
            ))}
          </VStack>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }
  if (props.type === 'radio') {
    const { value, onChange, title, isRequired, error, options, direction } = props;
    return (
      <VStack className="w-full p-3" space="lg">
        {title && <Heading size="xl">{title}</Heading>}
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText>{title}</FormControlLabelText>}
          </FormControlLabel>
          <VStack space="md">
            <RadioGroup value={(value ?? '') as string} onChange={onChange}>
              <VStack space={direction === 'horizontal' ? 'xs' : 'sm'}>
                {direction === 'horizontal' ? (
                  <HStack space="lg">
                    {options.map((option, index) => (
                      <Radio key={index} value={option.value as string}>
                        <RadioIndicator>
                          <RadioIcon />
                        </RadioIndicator>
                        <RadioLabel>{option.label}</RadioLabel>
                      </Radio>
                    ))}
                  </HStack>
                ) : (
                  options.map((option, index) => (
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
            {options.map(
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
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }
}
