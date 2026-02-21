import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 모노레포 루트의 React 19 경로 (react-dom 19와 일치시킴)
const rootModules = path.resolve(__dirname, '../../../node_modules')

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}

    // React 버전 충돌 해결: design-system에 React 18이 로컬 설치되어 있지만
    // react-dom은 React 19 (root). 모두 React 19로 통일.
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> || {}),
      react: path.join(rootModules, 'react'),
      'react-dom': path.join(rootModules, 'react-dom'),
    }

    const { tamaguiPlugin } = await import('@tamagui/vite-plugin')
    config.plugins!.push(
      tamaguiPlugin({
        config: './src/config/tamagui.config.web.ts',
        components: ['tamagui'],
      })
    )
    return config
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: 'web',
  }),
  docs: {
    autodocs: true,
  },
}

export default config
