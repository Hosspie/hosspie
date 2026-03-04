import type { CodegenConfig } from '@graphql-codegen/cli';

// 📚 참고: https://www.apollographql.com/docs/react/development-testing/graphql-codegen
// Apollo 공식 문서에서는 client-preset 대신 typescript + typescript-operations 사용 권장

const config: CodegenConfig = {
  schema: '../api/src/schema.gql',
  documents: ['lib/graphql/operations/**/*.graphql'],
  generates: {
    // Operation 타입 + TypedDocumentNode + Hooks 생성
    'lib/graphql/operations/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~@hosspie/types',
      },
      plugins: [
        'typescript-operations',
        'typed-document-node',
        './codegen-plugins/apollo-hooks.js',
      ],
      config: {
        enumsAsTypes: true,
        skipTypename: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
