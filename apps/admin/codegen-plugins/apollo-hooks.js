/**
 * Custom GraphQL Codegen Plugin
 * Apollo Client v4 호환 hooks 자동 생성
 *
 * 📚 참고: https://www.apollographql.com/docs/react/development-testing/graphql-codegen
 * Apollo Client v4에서는 hook 타입이 namespace로 변경됨:
 * - QueryHookOptions → useQuery.Options
 * - MutationHookOptions → useMutation.Options
 */

const { concatAST, Kind } = require('graphql');

module.exports = {
  plugin: (schema, documents, config) => {
    const allAst = concatAST(documents.map((d) => d.document));

    const operations = allAst.definitions.filter((d) => d.kind === Kind.OPERATION_DEFINITION);

    if (operations.length === 0) {
      return '';
    }

    const imports = [`import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';`];

    const hooks = operations.map((op) => {
      const operationName = op.name?.value;
      if (!operationName) return '';

      const operationType = op.operation;

      switch (operationType) {
        case 'query':
          return `
export function use${operationName}Query(options?: useQuery.Options<${operationName}Query, ${operationName}QueryVariables>) {
  return useQuery(${operationName}Document, options);
}

export function use${operationName}LazyQuery(options?: useLazyQuery.Options<${operationName}Query, ${operationName}QueryVariables>) {
  return useLazyQuery(${operationName}Document, options);
}`;

        case 'mutation':
          return `
export function use${operationName}Mutation(options?: useMutation.Options<${operationName}Mutation, ${operationName}MutationVariables>) {
  return useMutation(${operationName}Document, options);
}`;

        default:
          return '';
      }
    });

    return [...imports, '', ...hooks.filter(Boolean)].join('\n');
  },
};
