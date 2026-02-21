import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';

import { Accordion } from '../../components/accordion';
import { Badge, BadgeText } from '../../components/badge';
import { Card } from '../../components/card';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

export type CardOption = {
  title: string;
  description: string;
  badges?: { variant?: 'success' | 'error' | 'warning' | 'info'; label?: string }[];
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
                            <ChevronUp size={16} color="#B8B8C8" />
                          ) : (
                            <ChevronDown size={16} color="#B8B8C8" />
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
