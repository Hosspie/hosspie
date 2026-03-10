import type { CodegenConfig } from '@graphql-codegen/cli';

// 📚 NestJS schema.gql에서 공통 타입 생성
// 프론트엔드와 백엔드에서 공유할 수 있는 타입

const config: CodegenConfig = {
  schema: '../../apps/api/src/schema.gql',
  generates: {
    './src/generated/graphql.ts': {
      plugins: ['typescript'],
      config: {
        enumsAsTypes: true,
        skipTypename: true,
        // 더 사용하기 쉬운 타입명 생성
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
  },
};

export default config;
