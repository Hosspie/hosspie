import { ChevronDownIcon, ChevronUpIcon, type LucideIcon } from 'lucide-react-native';
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
import {
  Badge,
  BadgeIcon,
  BadgeText,
  type IBadgeIconProps,
  type IBadgeProps,
} from '../../components/badge';
import { Card } from '../../components/card';
import { HStack } from '../../components/h-stack';
import { Heading } from '../../components/header';
import { Text } from '../../components/text';
import { VStack } from '../../components/v-stack';

export type CardOption = {
  title: string;
  description: string;
  badges?: (IBadgeProps & { icon?: IBadgeIconProps['as']; label?: string })[];
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
    <VStack className="p-3" space="xl">
      {options.map((option, index) => (
        <Card key={index} variant="outline">
          <VStack space="md">
            <VStack space="xs">
              <HStack space="sm">
                <Heading size="lg">{option.title}</Heading>
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
              <Text size="sm">{option.description}</Text>
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
                    <AccordionContentText>{option.expandable.content}</AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </VStack>
        </Card>
      ))}
    </VStack>
  );
}
