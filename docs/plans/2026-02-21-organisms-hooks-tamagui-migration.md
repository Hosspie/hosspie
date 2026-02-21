# Organisms + Hooks Tamagui Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 9 organism components and 2 hooks from Gluestack UI to Tamagui, completing the design system migration.

**Architecture:** Each organism/hook file is rewritten in-place. Imports change from Gluestack component wrappers to Tamagui component wrappers (or `tamagui` directly where no wrapper exists). All `className` Tailwind strings become Tamagui token props. Props interfaces are preserved for backward compatibility.

**Tech Stack:** Tamagui 2.0.0-rc.16, React Native 0.79, Expo SDK 53, react-hook-form, react-native-reanimated, lucide-react-native

---

## Important Context

### Available Component Wrappers (import from `../../components/xxx`)

| Wrapper Path | Exports |
|---|---|
| `../../components/stacks` | `YStack, XStack, ZStack` |
| `../../components/text` | `Text, H1, H2, H3, H4, H5, H6, Paragraph, SizableText` |
| `../../components/button` | `Button` |
| `../../components/input` | `Input` |
| `../../components/card` | `Card` |
| `../../components/accordion` | `Accordion` |
| `../../components/radio` | `RadioGroup` |
| `../../components/progress` | `Progress` |
| `../../components/badge` | `Badge, BadgeText` (custom styled) |
| `../../components/image` | `Image` |
| `../../components/label` | `Label` |
| `../../components/sheet` | `Sheet` |
| `../../components/dialog` | `Dialog` |

### Direct Tamagui Imports (no wrapper exists)

| Import | Components |
|---|---|
| `tamagui` | `TextArea`, `View` |

### Token Reference (from tamagui.config.ts)

```
Colors: $brandPrimary (#FF8A3D), $surfaceBase (#0A0A0F), $surfaceCard (#1A1A24), $surfaceElevated (#242433), $textPrimary (#FFFFFF), $textSecondary (#B8B8C8), $borderNormal (#2A2A3A), $error (#EF4444), $success (#10B981), $warning (#F59E0B), $info (#3B82F6)
Spacing: $1=4, $2=8, $3=12, $4=16, $6=24, $8=32, $12=48
```

### Tamagui Compound Component APIs

```tsx
// Accordion
<Accordion type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header><Accordion.Trigger>...</Accordion.Trigger></Accordion.Header>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion>

// RadioGroup
<RadioGroup value={val} onValueChange={setVal}>
  <RadioGroup.Item value="opt1" id="radio-1"><RadioGroup.Indicator /></RadioGroup.Item>
</RadioGroup>

// Progress
<Progress value={60}><Progress.Indicator /></Progress>

// Dialog (controlled)
<Dialog open={isOpen} onOpenChange={onClose}>
  <Dialog.Portal><Dialog.Overlay /><Dialog.Content>
    <Dialog.Title /><Dialog.Description /><Dialog.Close />
  </Dialog.Content></Dialog.Portal>
</Dialog>

// Sheet (controlled)
<Sheet open={isOpen} onOpenChange={onClose} modal snapPointsMode="percent" snapPoints={[85]} dismissOnSnapToBottom>
  <Sheet.Overlay /><Sheet.Frame><Sheet.Handle />{children}</Sheet.Frame>
</Sheet>

// Button with icon
<Button icon={IconComponent} iconAfter={IconComponent}>Text</Button>

// Toast
const toast = useToastController()
toast.show('Title', { message: 'body', duration: 3000 })
```

---

### Task 1: text-container

**Files:**
- Modify: `packages/design-system/src/organisms/text-container/index.tsx`

**Step 1: Rewrite text-container**

```tsx
import { H2 } from '../../components/text';
import { Text } from '../../components/text';
import { YStack } from '../../components/stacks';

interface TextContainerProps {
  title?: string;
  description?: string;
  align?: 'start' | 'center' | 'end';
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
} as const;

const TextContainer = ({ title, description, align = 'start' }: TextContainerProps) => {
  return (
    <YStack gap="$4" padding="$3" alignItems={alignMap[align]}>
      {title && <H2>{title}</H2>}
      {description && <Text fontSize="$3">{description}</Text>}
    </YStack>
  );
};

export { TextContainer };
```

**Step 2: Verify no TypeScript errors**

Run: `cd packages/design-system && npx tsc --noEmit --pretty 2>&1 | grep -A2 "text-container"`

**Step 3: Commit**

```bash
git add packages/design-system/src/organisms/text-container/index.tsx
git commit -m "feat: text-container를 Tamagui로 마이그레이션"
```

---

### Task 2: progress-bar

**Files:**
- Modify: `packages/design-system/src/organisms/progress-bar/index.tsx`

**Step 1: Rewrite progress-bar**

```tsx
import { Progress } from '../../components/progress';
import { Text } from '../../components/text';
import { YStack } from '../../components/stacks';

interface ProgressBarProps {
  value: number;
  caption?: string;
}

const ProgressBar = ({ value, caption }: ProgressBarProps) => {
  return (
    <YStack gap="$4" padding="$3">
      <Progress value={value} size="$1">
        <Progress.Indicator
          animation="fast"
          backgroundColor="$brandPrimary"
        />
      </Progress>
      {caption && <Text fontSize="$3">{caption}</Text>}
    </YStack>
  );
};

export { ProgressBar };
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/progress-bar/index.tsx
git commit -m "feat: progress-bar를 Tamagui로 마이그레이션"
```

---

### Task 3: background-layout

**Files:**
- Modify: `packages/design-system/src/organisms/background-layout/index.tsx`

**Step 1: Rewrite background-layout**

```tsx
import React from 'react';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { YStack } from '../../components/stacks';

interface SafeAreaViewProps {
  children: React.ReactNode;
  edges?: Edge[];
}

const BackgroundLayout = ({ children, edges = ['top', 'bottom'] }: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

  const getPadding = () => {
    const style: Record<string, number> = {};

    if (edges.includes('top')) {
      style.paddingTop = insets.top;
    }
    if (edges.includes('bottom')) {
      style.paddingBottom = insets.bottom;
    }
    if (edges.includes('left')) {
      style.paddingLeft = insets.left;
    }
    if (edges.includes('right')) {
      style.paddingRight = insets.right;
    }

    return style;
  };

  const paddings = getPadding();

  return (
    <YStack flex={1} style={paddings}>
      {children}
    </YStack>
  );
};

export { BackgroundLayout };
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/background-layout/index.tsx
git commit -m "feat: background-layout를 Tamagui로 마이그레이션"
```

---

### Task 4: image-container

**Files:**
- Modify: `packages/design-system/src/organisms/image-container/index.tsx`

**Step 1: Rewrite image-container**

```tsx
import { type FC } from 'react';
import { type SvgProps } from 'react-native-svg';

import { Image } from '../../components/image';
import { YStack } from '../../components/stacks';

type SizeKey = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';

interface ImageContainerProps {
  src: string | FC<SvgProps>;
  alt?: string;
  size?: SizeKey;
  align?: 'start' | 'center' | 'end';
}

const sizeMap: Record<SizeKey, number | string> = {
  '2xs': 24,
  xs: 40,
  sm: 64,
  md: 80,
  lg: 96,
  xl: 128,
  '2xl': 256,
  full: '100%',
  none: 128,
};

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
} as const;

const ImageContainer = ({
  src,
  alt = 'image',
  size = 'md',
  align = 'center',
}: ImageContainerProps) => {
  const isSvgComponent = typeof src === 'function';

  if (isSvgComponent) {
    const SvgComponent = src as FC<SvgProps>;
    const svgSize = sizeMap[size] || 80;

    return (
      <YStack width="100%" alignItems={alignMap[align]}>
        <SvgComponent width={svgSize as number} height={svgSize as number} />
      </YStack>
    );
  }

  const imgSize = sizeMap[size] || 80;

  return (
    <YStack width="100%" alignItems={alignMap[align]}>
      <Image
        source={{ uri: src as string }}
        width={imgSize as number}
        height={imgSize as number}
        alt={alt}
      />
    </YStack>
  );
};

export { ImageContainer };
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/image-container/index.tsx
git commit -m "feat: image-container를 Tamagui로 마이그레이션"
```

---

### Task 5: buttons

**Files:**
- Modify: `packages/design-system/src/organisms/buttons/index.tsx`

**Step 1: Rewrite buttons**

Tamagui Button accepts `icon` / `iconAfter` props and text as children. No ButtonGroup/ButtonText/ButtonIcon needed.

```tsx
import { type LucideIcon } from 'lucide-react-native';
import { type ComponentType } from 'react';

import { Button } from '../../components/button';
import { XStack, YStack } from '../../components/stacks';

export interface IButtonProps {
  text: string;
  iconPosition?: 'left' | 'right';
  icon?: LucideIcon | ComponentType;
  backgroundColor?: string;
  textColor?: string;
  action?: string;
  disabled?: boolean;
  onPress?: () => void;
}

interface ButtonsProps {
  direction?: 'horizontal' | 'vertical';
  buttons: IButtonProps[];
  placement?: 'default' | 'bottom';
}

const Buttons = ({ direction = 'vertical', buttons, placement = 'default' }: ButtonsProps) => {
  const Stack = direction === 'horizontal' ? XStack : YStack;
  const marginTop = placement === 'bottom' ? 'auto' : undefined;

  return (
    <Stack
      gap="$4"
      padding="$3"
      {...(marginTop ? { marginTop } : {})}
      {...(direction === 'horizontal' ? {} : {})}
    >
      {buttons.map(
        (
          {
            text,
            icon,
            backgroundColor,
            textColor,
            iconPosition = 'right',
            disabled,
            onPress,
            ...props
          },
          index
        ) => {
          const iconProps =
            iconPosition === 'left'
              ? { icon: icon as any }
              : { iconAfter: icon as any };

          return (
            <Button
              key={index}
              disabled={disabled}
              onPress={onPress}
              {...(icon ? iconProps : {})}
              {...(backgroundColor ? { backgroundColor } : {})}
              {...(textColor ? { color: textColor } : {})}
              {...(direction === 'horizontal' ? { flex: 1 } : {})}
              {...(disabled ? { opacity: 0.5 } : {})}
              {...props}
            >
              {text}
            </Button>
          );
        }
      )}
    </Stack>
  );
};

export { Buttons };
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/buttons/index.tsx
git commit -m "feat: buttons를 Tamagui로 마이그레이션"
```

---

### Task 6: cards

**Files:**
- Modify: `packages/design-system/src/organisms/cards/index.tsx`

**Step 1: Rewrite cards**

```tsx
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';

import { Accordion } from '../../components/accordion';
import { Badge, BadgeText } from '../../components/badge';
import { Card } from '../../components/card';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

import type { IBadgeProps } from '../../components/badge';

export type CardOption = {
  title: string;
  description: string;
  badges?: (IBadgeProps & { icon?: any; label?: string })[];
  expandable?: {
    type: 'text';
    label: string;
    content: string;
  };
};

export interface CardsOrganismProps {
  options: CardOption[];
}

export function CardsOrganism({ options }: CardsOrganismProps) {
  return (
    <YStack padding="$3" gap="$6">
      {options.map((option, index) => (
        <Card key={index} bordered padding="$4">
          <YStack gap="$4">
            <YStack gap="$1">
              <XStack gap="$2" alignItems="center">
                <H3>{option.title}</H3>
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
              <Text fontSize="$1" color="$textSecondary">{option.description}</Text>
            </YStack>

            {option.expandable && (
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
                          <Text>{option.expandable!.label}</Text>
                          {open ? (
                            <ChevronUp size={16} color="$textSecondary" />
                          ) : (
                            <ChevronDown size={16} color="$textSecondary" />
                          )}
                        </XStack>
                      )}
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content padding="$3">
                    <Text color="$textSecondary">{option.expandable.content}</Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            )}
          </YStack>
        </Card>
      ))}
    </YStack>
  );
}
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/cards/index.tsx
git commit -m "feat: cards를 Tamagui로 마이그레이션"
```

---

### Task 7: fabs

**Files:**
- Modify: `packages/design-system/src/organisms/fabs/index.tsx`

**Step 1: Rewrite fabs**

Keep react-native-reanimated FadeInDown/FadeOutDown. Replace Box/Icon with Tamagui + lucide direct.

```tsx
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TouchableHighlight } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { XStack, YStack } from '../../components/stacks';
import { Text } from '../../components/text';

interface FabProps {
  icon?: LucideIcon;
  label?: string;
  onPress: () => void;
}

interface FabsOrganismProps {
  isFoldable?: boolean;
  placement?: 'left' | 'right';
  fabs: FabProps[];
}

const FabsOrganism = ({ isFoldable = false, placement = 'right', fabs }: FabsOrganismProps) => {
  const [isFolded, setIsFolded] = useState<boolean>(true);
  const itemsAlignment = placement === 'right' ? 'flex-end' : 'flex-start';

  if (!isFoldable) {
    const hasOnlyOneFab = fabs.length === 1;

    return (
      <YStack flex={1} alignItems={itemsAlignment} justifyContent="flex-end" gap="$4" padding="$4">
        {fabs.map((fab, index) => {
          const hasOnlyIcon = !fab.label && fab.icon;
          const bgColor = hasOnlyOneFab ? '$brandPrimary' : '$surfaceElevated';
          const borderRadius = hasOnlyIcon ? 999 : '$3';
          const FabIcon = fab.icon;

          return (
            <TouchableHighlight key={index} onPress={fab.onPress}>
              <XStack
                backgroundColor={bgColor}
                alignItems="center"
                justifyContent="center"
                gap="$2"
                borderRadius={borderRadius}
                padding="$2"
              >
                {FabIcon && <FabIcon size={24} color="white" />}
                {fab.label && <Text color="$textPrimary">{fab.label}</Text>}
              </XStack>
            </TouchableHighlight>
          );
        })}
      </YStack>
    );
  }

  const handlePressFoldButton = () => {
    setIsFolded(!isFolded);
  };

  return (
    <YStack flex={1} alignItems={itemsAlignment} justifyContent="flex-end" gap="$4" padding="$4">
      {!isFolded && (
        <Animated.View style={{ gap: 16 }} entering={FadeInDown} exiting={FadeOutDown}>
          {fabs.map((fab, index) => {
            const FabIcon = fab.icon;
            return (
              <TouchableHighlight key={index} onPress={fab.onPress}>
                <XStack
                  backgroundColor="$surfaceElevated"
                  alignItems="center"
                  justifyContent="center"
                  gap="$2"
                  borderRadius="$3"
                  padding="$2"
                >
                  {FabIcon && <FabIcon size={24} color="white" />}
                  {fab.label && <Text color="$textPrimary">{fab.label}</Text>}
                </XStack>
              </TouchableHighlight>
            );
          })}
        </Animated.View>
      )}
      <Pressable
        onPress={handlePressFoldButton}
        style={{
          backgroundColor: '#FF8A3D',
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        {isFolded ? (
          <ChevronUp size={24} color="white" />
        ) : (
          <ChevronDown size={24} color="white" />
        )}
      </Pressable>
    </YStack>
  );
};

export { FabsOrganism };
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/fabs/index.tsx
git commit -m "feat: fabs를 Tamagui로 마이그레이션"
```

---

### Task 8: form-field

**Files:**
- Modify: `packages/design-system/src/organisms/form-field/index.tsx`

**Step 1: Rewrite form-field**

This is the most complex organism. It supports 4 field types: input, textarea, card, radio.

Key changes:
- FormControl/FormControlLabel/FormControlError -> YStack + Label + inline error Text
- Input/InputField -> Input (single component)
- Textarea/TextareaInput -> TextArea from tamagui
- Radio/RadioIndicator/RadioIcon/RadioLabel -> RadioGroup.Item/RadioGroup.Indicator + Label
- Accordion subcomponents -> Accordion compound API

```tsx
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

import type { IBadgeProps } from '../../components/badge';

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
          icon?: any;
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
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/form-field/index.tsx
git commit -m "feat: form-field를 Tamagui로 마이그레이션"
```

---

### Task 9: form-fields

**Files:**
- Modify: `packages/design-system/src/organisms/form-fields/index.tsx`

**Step 1: Rewrite form-fields**

Same Tamagui patterns as form-field, plus react-hook-form Controller integration preserved.

```tsx
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextArea, View } from 'tamagui';

import { Accordion } from '../../components/accordion';
import { Badge, BadgeText } from '../../components/badge';
import { Card } from '../../components/card';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { RadioGroup } from '../../components/radio';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

import type { IBadgeProps } from '../../components/badge';

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
        badges?: (IBadgeProps & { icon?: any; label?: string })[];
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

export function FormFieldsOrganism<T extends FieldValues>({
  control,
  title,
  fields,
}: FormFieldsProps<T>) {
  return (
    <YStack width="100%" padding="$3" gap="$6">
      {title && <H3>{title}</H3>}
      {fields.map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name as Path<T>}
          rules={field.rules}
          render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
            <YStack gap="$2">
              {field.description && <Label>{field.description}</Label>}

              {field.type === 'input' && (
                <Input
                  placeholder={field.placeholder}
                  value={value}
                  onChangeText={onChange}
                  borderColor={error ? '$error' : '$borderNormal'}
                />
              )}

              {field.type === 'textarea' && (
                <TextArea
                  placeholder={field.placeholder}
                  value={value}
                  onChangeText={onChange}
                  borderColor={error ? '$error' : '$borderNormal'}
                />
              )}

              {field.type === 'card' && (
                <RadioGroup
                  value={value as string}
                  onValueChange={onChange}
                >
                  <YStack gap="$6">
                    {field.options.map((option, index) => (
                      <Card key={index} bordered padding="$4">
                        <YStack gap="$4">
                          <YStack gap="$1" position="relative">
                            <View position="absolute" right={0} top={0} zIndex={1}>
                              <RadioGroup.Item
                                value={option.value as string}
                                id={`${field.name}-card-${index}`}
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
              )}

              {field.type === 'radio' && (
                <YStack gap="$4">
                  <RadioGroup
                    value={value as string}
                    onValueChange={onChange}
                  >
                    {field.direction === 'horizontal' ? (
                      <XStack gap="$6">
                        {field.options.map((option, index) => (
                          <XStack key={index} gap="$2" alignItems="center">
                            <RadioGroup.Item
                              value={option.value as string}
                              id={`${field.name}-radio-${index}`}
                            >
                              <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor={`${field.name}-radio-${index}`}>
                              {option.label}
                            </Label>
                          </XStack>
                        ))}
                      </XStack>
                    ) : (
                      <YStack gap="$2">
                        {field.options.map((option, index) => (
                          <XStack key={index} gap="$2" alignItems="center">
                            <RadioGroup.Item
                              value={option.value as string}
                              id={`${field.name}-radio-${index}`}
                            >
                              <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor={`${field.name}-radio-${index}`}>
                              {option.label}
                            </Label>
                          </XStack>
                        ))}
                      </YStack>
                    )}
                  </RadioGroup>

                  {field.options.map(
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
              )}

              {error && <ErrorMessage message={error.message ?? ''} />}
            </YStack>
          )}
        />
      ))}
    </YStack>
  );
}
```

**Step 2: Commit**

```bash
git add packages/design-system/src/organisms/form-fields/index.tsx
git commit -m "feat: form-fields를 Tamagui로 마이그레이션"
```

---

### Task 10: modal hook

**Files:**
- Delete: `packages/design-system/src/hooks/modal/modal.tsx`
- Modify: `packages/design-system/src/hooks/modal/index.tsx`

**Step 1: Delete modal.tsx (Gluestack Modal wrapper)**

```bash
rm packages/design-system/src/hooks/modal/modal.tsx
```

**Step 2: Rewrite modal/index.tsx**

Replace with Tamagui Dialog + Sheet. Keep IModalProps interface.

```tsx
import { X } from 'lucide-react-native';
import React, { useMemo } from 'react';

import { Button } from '../../components/button';
import { Dialog } from '../../components/dialog';
import { Sheet } from '../../components/sheet';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

type IModalProps =
  | {
      type?: 'dialog';
      isOpen: boolean;
      onClose: () => void;
      title: string;
      body: string;
      cancelButtonText: string;
      confirmButtonText: string;
    }
  | {
      type?: 'bottomSheet';
      isOpen: boolean;
      onClose: () => void;
      children: React.ReactNode;
    };

export const useModal = () => {
  const Modal = useMemo(() => {
    return (props: IModalProps) => {
      if (props.type === 'bottomSheet') {
        const { children, isOpen, onClose } = props;
        return (
          <Sheet
            open={isOpen}
            onOpenChange={(open: boolean) => {
              if (!open) onClose();
            }}
            modal
            snapPointsMode="percent"
            snapPoints={[85]}
            dismissOnSnapToBottom
            zIndex={100000}
            animation="medium"
          >
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Sheet.Frame padding="$4">
              <Sheet.Handle />
              <YStack width="100%">{children}</YStack>
            </Sheet.Frame>
          </Sheet>
        );
      }

      const { isOpen, onClose, title, body, cancelButtonText, confirmButtonText } = props;
      return (
        <Dialog
          open={isOpen}
          onOpenChange={(open: boolean) => {
            if (!open) onClose();
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="fast"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              key="content"
              bordered
              elevate
              animation={[
                'fast',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
              padding="$6"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Dialog.Title>
                  <H3>{title}</H3>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button
                    size="$3"
                    circular
                    icon={X}
                    chromeless
                  />
                </Dialog.Close>
              </XStack>

              <Dialog.Description>
                <Text color="$textSecondary" fontSize="$1">
                  {body}
                </Text>
              </Dialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button variant="outlined" onPress={onClose}>
                    {cancelButtonText}
                  </Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button onPress={onClose}>
                    {confirmButtonText}
                  </Button>
                </Dialog.Close>
              </XStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      );
    };
  }, []);

  return {
    Modal,
  };
};
```

**Step 3: Commit**

```bash
git add -A packages/design-system/src/hooks/modal/
git commit -m "feat: useModal 훅을 Tamagui Dialog/Sheet으로 마이그레이션"
```

---

### Task 11: toast hook

**Files:**
- Delete: `packages/design-system/src/hooks/toast/toast.tsx`
- Modify: `packages/design-system/src/hooks/toast/index.tsx`

**Step 1: Delete toast.tsx (Gluestack Toast wrapper)**

```bash
rm packages/design-system/src/hooks/toast/toast.tsx
```

**Step 2: Rewrite toast/index.tsx**

Use Tamagui's `useToastController` + `useToastState`. The provider/viewport setup must be done at the app root level — document this.

```tsx
import { useToastController, useToastState, Toast, ToastViewport } from '@tamagui/toast';
import React from 'react';

import { XStack, YStack } from '../../components/stacks';
import { Text } from '../../components/text';

export type ModeType = 'light' | 'dark' | 'system';

/**
 * Toast 뷰포트 컴포넌트 — 앱 루트에 배치해야 합니다.
 *
 * 사용법:
 * ```tsx
 * import { ToastProvider } from '@tamagui/toast'
 * import { ToastViewportComponent } from '@hosspie/design-system/hooks/toast'
 *
 * <ToastProvider>
 *   <App />
 *   <ToastViewportComponent />
 * </ToastProvider>
 * ```
 */
export function ToastViewportComponent() {
  return <ToastViewport top={60} left={0} right={0} />;
}

/**
 * 현재 활성화된 Toast를 렌더링하는 컴포넌트 — 앱 루트에 배치해야 합니다.
 */
export function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  const isError = currentToast.customData?.type === 'error';

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="fast"
      backgroundColor={isError ? '$error' : '$surfaceElevated'}
      borderWidth={isError ? 1 : 0}
      borderColor={isError ? '$error' : undefined}
      padding="$4"
      borderRadius="$3"
    >
      <YStack gap="$1">
        {currentToast.title && (
          <Toast.Title>
            <Text fontWeight="600" color="$textPrimary">
              {currentToast.title}
            </Text>
          </Toast.Title>
        )}
        {currentToast.message && (
          <Toast.Description>
            <Text fontSize="$1" color="$textSecondary">
              {currentToast.message}
            </Text>
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}

export const useToast = () => {
  const toast = useToastController();

  const showToast = ({
    type = 'default',
    message,
    title,
  }: {
    type?: 'default' | 'error';
    message: string;
    title?: string;
  }) => {
    toast.show(title ?? '', {
      message,
      duration: 3000,
      customData: { type },
    });
  };

  return {
    showToast,
  };
};
```

**Step 3: Commit**

```bash
git add -A packages/design-system/src/hooks/toast/
git commit -m "feat: useToast 훅을 Tamagui Toast로 마이그레이션"
```

---

### Task 12: Final verification and combined commit

**Step 1: Verify TypeScript compilation**

Run: `cd packages/design-system && npx tsc --noEmit --pretty 2>&1 | head -50`

Fix any TypeScript errors that arise.

**Step 2: Check no Gluestack imports remain in organisms/hooks**

Run: `grep -r "@gluestack" packages/design-system/src/organisms/ packages/design-system/src/hooks/ || echo "No Gluestack imports found"`
Run: `grep -r "nativewind" packages/design-system/src/organisms/ packages/design-system/src/hooks/ || echo "No NativeWind imports found"`
Run: `grep -r "@legendapp" packages/design-system/src/organisms/ packages/design-system/src/hooks/ || echo "No LegendApp imports found"`
Run: `grep -r "className" packages/design-system/src/organisms/ packages/design-system/src/hooks/ || echo "No className usage found"`

**Step 3: Create PR**

```bash
gh pr create --base sprint/tamagui-migration --title "feat: Organisms + Hooks를 Tamagui로 마이그레이션" --body "$(cat <<'EOF'
## Summary
- 9개 organism 컴포넌트를 Tamagui로 전환 (text-container, progress-bar, background-layout, image-container, buttons, cards, fabs, form-field, form-fields)
- useModal, useToast 훅을 Tamagui Dialog/Sheet/Toast로 전환
- Gluestack UI / NativeWind className 의존성 완전 제거

## Test plan
- [ ] text-container: 타이틀/설명 텍스트 렌더링 확인
- [ ] progress-bar: 진행률 표시 확인
- [ ] background-layout: SafeArea 패딩 적용 확인
- [ ] image-container: 이미지/SVG 렌더링 확인
- [ ] buttons: 가로/세로 방향, 아이콘 위치 확인
- [ ] cards: 뱃지, 아코디언 펼침 확인
- [ ] fabs: 접기/펼치기 애니메이션 확인
- [ ] form-field: input/textarea/card/radio 4가지 타입 확인
- [ ] form-fields: react-hook-form 연동 확인
- [ ] useModal: dialog/bottomSheet 타입 확인
- [ ] useToast: default/error 토스트 표시 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
