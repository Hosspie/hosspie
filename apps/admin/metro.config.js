const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.join(__dirname, '..', '..');

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 모노레포에서 React 인스턴스 중복 방지: 항상 루트의 단일 React 사용
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // react 관련 모듈은 루트의 단일 인스턴스로 강제
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return {
      filePath: require.resolve(moduleName, { paths: [workspaceRoot] }),
      type: 'sourceFile',
    };
  }

  // tslib ESM 진입점이 Metro에서 CJS interop 오류를 일으킴 → CJS로 강제
  if (moduleName === 'tslib') {
    return {
      filePath: require.resolve('tslib/tslib.js', { paths: [workspaceRoot] }),
      type: 'sourceFile',
    };
  }

  // 기본 해석 시도 후, 실패하면 루트 node_modules에서 재시도
  try {
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    // pnpm strict 모드에서 못 찾는 경우 루트 node_modules에서 해석
    try {
      return {
        filePath: require.resolve(moduleName, {
          paths: [projectRoot, workspaceRoot],
        }),
        type: 'sourceFile',
      };
    } catch {
      throw error;
    }
  }
};

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver.assetExts = resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...resolver.sourceExts, 'svg'];

config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

module.exports = config;
