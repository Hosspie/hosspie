import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import * as Types from '@hosspie/types';

export type CreateOnboardingMutationVariables = Types.Exact<{
  input: Types.CreateGuesthouseInput;
}>;

export type CreateOnboardingMutation = {
  createOnboarding: {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website?: string | null;
    dinnerPartyType: Types.DinnerPartyType;
    dinnerPartyDescription?: string | null;
    onboardingStatus: Types.OnboardingStatus;
    createdAt: any;
    updatedAt: any;
    rooms: {
      id: string;
      name: string;
      capacity: number;
      gender: Types.Gender;
      hasBathroom: boolean;
    }[];
  };
};

export const CreateOnboardingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateOnboarding' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateGuesthouseInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createOnboarding' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'website' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dinnerPartyType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dinnerPartyDescription' } },
                { kind: 'Field', name: { kind: 'Name', value: 'onboardingStatus' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'rooms' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'capacity' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'hasBathroom' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateOnboardingMutation, CreateOnboardingMutationVariables>;

export function useCreateOnboardingMutation(
  options?: useMutation.Options<CreateOnboardingMutation, CreateOnboardingMutationVariables>
) {
  return useMutation(CreateOnboardingDocument, options);
}
