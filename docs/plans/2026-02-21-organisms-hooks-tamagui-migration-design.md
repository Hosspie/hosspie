# Organisms + Hooks Tamagui Migration Design

## Goal

Migrate 9 organism components and 2 hooks from Gluestack UI to Tamagui, completing the design system migration.

## Import Strategy

Import from component wrappers (`../../components/xxx`) where they exist. Import directly from `tamagui` only for components without wrappers (TextArea, View).

### Import Mapping

| Old Import Path | New Import Path | Components |
|---|---|---|
| `../../components/box` | `../../components/stacks` | YStack (as container) |
| `../../components/h-stack` | `../../components/stacks` | XStack |
| `../../components/v-stack` | `../../components/stacks` | YStack |
| `../../components/header` (Heading) | `../../components/text` | H1, H2, H3 etc. |
| `../../components/icon` (Icon) | `lucide-react-native` | Icons directly |
| `../../components/form-control` | `../../components/form` + `../../components/label` | Form, Label + inline error |
| `../../components/button` (ButtonGroup/Text/Icon) | `../../components/button` | Button (children pattern) |
| `../../components/text-area` | `tamagui` | TextArea |
| `../../components/action-sheet` | `../../components/sheet` | Sheet |
| `../../components/progress` (ProgressFilledTrack) | `../../components/progress` | Progress (use Progress.Indicator) |
| `../../components/radio` (Radio, RadioIndicator, etc.) | `../../components/radio` | RadioGroup (use RadioGroup.Item, .Indicator) |
| `../../components/accordion` (subcomponents) | `../../components/accordion` | Accordion (use Accordion.Item, .Trigger, etc.) |

## Styling Migration

All `className` Tailwind/NativeWind classes become Tamagui token props:

- `className="p-3"` -> `padding="$3"`
- `className="flex-1"` -> `flex={1}`
- `space="md"` -> `gap="$4"`
- `className="bg-primary-500"` -> `backgroundColor="$brandPrimary"`
- `className="bg-secondary-500"` -> `backgroundColor="$surfaceElevated"`
- `className="text-typography-500"` -> `color="$textSecondary"`

## Component Designs

### 1. text-container

Replace Heading -> H2 from text wrapper, VStack from stacks wrapper, className -> props.

### 2. progress-bar

Replace ProgressFilledTrack -> Progress.Indicator, VStack from stacks.

### 3. background-layout

Replace Box -> YStack from stacks. Keep useSafeAreaInsets logic intact.

### 4. image-container

Replace Box -> YStack/View. Image stays from image wrapper. Keep SVG component logic.

### 5. buttons

Remove ButtonGroup/ButtonText/ButtonIcon. Tamagui Button accepts children directly (Text + Icon as children). Keep IButtonProps and ButtonsProps interfaces.

### 6. cards

Replace VStack/HStack -> YStack/XStack from stacks. Heading -> H3 from text. Accordion subcomponents -> Tamagui Accordion compound API. Badge stays from badge wrapper.

### 7. fabs

Replace Box -> YStack/View, Icon -> lucide icons directly. Keep react-native-reanimated FadeInDown/FadeOutDown animations.

### 8. form-field (complex)

FormControl -> Form + Label + inline error display with YStack. RadioGroup.Item pattern. Accordion compound API. TextArea from tamagui.

### 9. form-fields (complex)

Same patterns as form-field + keep react-hook-form Controller integration.

### 10. modal hook

Delete `modal.tsx` (Gluestack wrapper). Rewrite:
- 'dialog' type -> Tamagui Dialog (Portal, Overlay, Content, Title, Description)
- 'bottomSheet' type -> Tamagui Sheet (Frame, Overlay, Handle)
- Keep IModalProps interface

### 11. toast hook

Delete `toast.tsx` (Gluestack wrapper). Rewrite using Tamagui Toast (ToastProvider, ToastViewport, Toast). Keep showToast interface.

## Files to Delete

- `src/hooks/modal/modal.tsx`
- `src/hooks/toast/toast.tsx`

## Execution Order

1. Simple: text-container -> progress-bar -> background-layout -> image-container
2. Medium: buttons -> cards -> fabs
3. Complex: form-field -> form-fields
4. Hooks: modal -> toast

## Constraints

- Preserve all existing Props interfaces (no breaking changes)
- Use pnpm (not npm/yarn)
- Don't modify src/components/ (already migrated)
- Korean comments and commit messages
- lucide-react-native for icons
- react-hook-form integration preserved
- react-native-reanimated animations preserved
