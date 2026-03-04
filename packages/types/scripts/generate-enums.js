#!/usr/bin/env node

/**
 * Prisma Schema에서 enum을 추출하여 TypeScript enum 파일 생성
 *
 * 이 스크립트는 packages/database/prisma/schema.prisma를 읽어서
 * packages/types/src/generated/enums.ts 파일을 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const PRISMA_SCHEMA_PATH = path.join(__dirname, '../../database/prisma/schema.prisma');
const OUTPUT_PATH = path.join(__dirname, '../src/generated/enums.ts');

function extractEnumsFromPrismaSchema(schemaContent) {
  const enumPattern = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  const enums = [];

  let match;
  while ((match = enumPattern.exec(schemaContent)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];

    // enum 값 추출
    const values = enumBody
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'))
      .map(line => line.split(/\s+/)[0]) // 주석 제거
      .filter(Boolean);

    enums.push({ name: enumName, values });
  }

  return enums;
}

function generateEnumFile(enums) {
  const header = `// 📚 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Prisma Schema에서 enum을 추출하여 TypeScript enum으로 변환합니다.
//
// 생성 명령어: pnpm codegen:types
// 원본: packages/database/prisma/schema.prisma

`;

  const enumDefinitions = enums.map(({ name, values }) => {
    const valueLines = values.map(value => `  ${value} = '${value}',`).join('\n');

    return `export enum ${name} {
${valueLines}
}`;
  }).join('\n\n');

  return header + enumDefinitions + '\n';
}

function main() {
  try {
    console.log('🔍 Prisma Schema 읽는 중...');
    const schemaContent = fs.readFileSync(PRISMA_SCHEMA_PATH, 'utf8');

    console.log('📝 Enum 추출 중...');
    const enums = extractEnumsFromPrismaSchema(schemaContent);

    if (enums.length === 0) {
      console.warn('⚠️  추출된 enum이 없습니다.');
      return;
    }

    console.log(`✅ ${enums.length}개 enum 발견: ${enums.map(e => e.name).join(', ')}`);

    console.log('📦 TypeScript enum 파일 생성 중...');
    const enumFileContent = generateEnumFile(enums);

    // 디렉토리 생성
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 파일 쓰기
    fs.writeFileSync(OUTPUT_PATH, enumFileContent, 'utf8');

    console.log(`✅ 생성 완료: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    process.exit(1);
  }
}

main();
