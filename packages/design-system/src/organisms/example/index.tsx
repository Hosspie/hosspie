import {
  Camera,
  Activity,
  ChevronUp,
  ChevronDown,
  Plus,
  Globe,
  Play,
  Settings,
  Check,
  AlertCircle,
  Circle,
} from 'lucide-react-native';
import { useState } from 'react';
import colors from 'tailwindcss/colors';

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
import {
  AvatarGroup,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from '../../components/avatar';
import { Badge, BadgeText } from '../../components/badge';
import { Box } from '../../components/box';
import { Button, ButtonText } from '../../components/button';
import { Card } from '../../components/card';
import { Center } from '../../components/center';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '../../components/check-box';
import { Divider } from '../../components/divider';
import { Fab, FabIcon, FabLabel } from '../../components/fab';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '../../components/form-control';
import { HStack } from '../../components/h-stack';
import { Icon } from '../../components/icon';
import { Image } from '../../components/image';
import { Input, InputField } from '../../components/input';
import { Menu, MenuItem, MenuItemLabel } from '../../components/menu';
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '../../components/popover';
import { Pressable } from '../../components/pressable';
import { Progress, ProgressFilledTrack } from '../../components/progress';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '../../components/radio';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '../../components/select';
import { Skeleton, SkeletonText } from '../../components/skeleton';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '../../components/slider';
import { Spinner } from '../../components/spinner';
import { Switch } from '../../components/switch';
import { Text } from '../../components/text';
import { Textarea, TextareaInput } from '../../components/text-area';
import { VStack } from '../../components/v-stack';

const ExampleModule = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box className="bg-primary-100 p-4">
      <VStack space="md">
        <Box className="w-[325px] gap-4 p-3 rounded-md bg-background-100">
          <Skeleton variant="sharp" className="h-[150px]" />
          <SkeletonText _lines={3} className="h-3" />
          <HStack className="gap-2 align-middle">
            <Skeleton variant="circular" className="h-[24px] w-[24px] mr-2" />
            <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
          </HStack>
        </Box>
        <Fab>
          <FabLabel>Add</FabLabel>
          <FabIcon as={Plus} />
        </Fab>
        <Icon className="text-typography-500" as={Camera} />
        <Icon className="text-typography-500" as={Activity} />
        <Image source={{ uri: 'https://github.com/shadcn.png' }} />
        <AvatarGroup>
          <Avatar>
            <AvatarFallbackText />
            <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
            <AvatarBadge />
          </Avatar>
        </AvatarGroup>

        <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="m-5 w-[90%] border border-outline-200"
        >
          <AccordionItem value="a">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>How do I place an order?</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUp} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDown} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <AccordionContentText>
                To place an order, simply select the products you want, proceed to checkout, provide
                shipping and payment information, and finalize your purchase.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
          <Divider />
          <AccordionItem value="b">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>What payment methods do you accept?</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUp} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDown} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <AccordionContentText>
                We accept all major credit cards, including Visa, Mastercard, and American Express.
                We also support payments through PayPal.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Popover
          isOpen={isOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          placement="bottom"
          size="md"
          trigger={(triggerProps) => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Open Popover</ButtonText>
              </Button>
            );
          }}
        >
          <PopoverBackdrop />
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Text className="text-typography-900">Alex, Annie and many others</Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Menu
          placement="top"
          offset={5}
          disabledKeys={['Settings']}
          trigger={({ ...triggerProps }) => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Menu</ButtonText>
              </Button>
            );
          }}
        >
          <MenuItem key="Add account" textValue="Add account">
            <Icon as={Plus} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Add account</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Community" textValue="Community">
            <Icon as={Globe} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Community</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Plugins" textValue="Plugins">
            <Icon as={Play} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Plugins</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Settings" textValue="Settings">
            <Icon as={Settings} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Settings</MenuItemLabel>
          </MenuItem>
        </Menu>
        <Text size="2xl" className="font-mono">
          헤딩
        </Text>
        <Text size="2xl" className="font-body">
          바디
        </Text>
        <Progress value={40} size="md">
          <ProgressFilledTrack />
        </Progress>
        <Spinner />
        <Button action="secondary" size="md">
          <ButtonText>클릭</ButtonText>
        </Button>
        <Pressable onPress={() => console.log('Hello')} className="p-5 bg-primary-500">
          <Badge action="error" variant="outline" size="lg">
            <BadgeText>Badge</BadgeText>
          </Badge>
        </Pressable>
        <Card size="md" variant="elevated" className="m-3">
          <Text size="sm">Start building your next project in minutes</Text>
        </Card>
        <Checkbox size="md" isInvalid={false} isDisabled={false} value={''}>
          <CheckboxIndicator>
            <CheckboxIcon as={Check} />
          </CheckboxIndicator>
          <CheckboxLabel>Label</CheckboxLabel>
        </Checkbox>
        <FormControl size="md" isDisabled={false} isReadOnly={false} isRequired={false}>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              type="password"
              placeholder="password"
              value={''}
              onChangeText={(text) => console.log(text)}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>Must be atleast 6 characters.</FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>Atleast 6 characters are required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <RadioGroup>
          <Radio value="change" size="md" isInvalid={false} isDisabled={false}>
            <RadioIndicator>
              <RadioIcon as={Circle} />
            </RadioIndicator>
            <RadioLabel>Label</RadioLabel>
          </Radio>
        </RadioGroup>
        <Select>
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Select option" />
            <SelectIcon className="mr-3" as={ChevronDown} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="UX Research" value="ux" />
              <SelectItem label="Web Development" value="web" />
              <SelectItem
                label="Cross Platform Development Process"
                value="Cross Platform Development Process"
              />
              <SelectItem label="UI Designing" value="ui" isDisabled={true} />
              <SelectItem label="Backend Development" value="backend" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Center className="w-[300px]">
          <Slider
            defaultValue={30}
            size="md"
            orientation="horizontal"
            isDisabled={false}
            isReversed={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Center>
        <Switch
          size="md"
          isDisabled={false}
          trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
          thumbColor={colors.neutral[50]}
          ios_backgroundColor={colors.neutral[300]}
        />
        <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false}>
          <TextareaInput placeholder="Your text goes here..." />
        </Textarea>
      </VStack>
    </Box>
  );
};

export { ExampleModule };
