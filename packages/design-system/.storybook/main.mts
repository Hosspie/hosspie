export default {
  stories: [
    '../src/components/**/*.@(mdx|stories.@(ts|tsx))',
    '../src/organisms/**/*.@(mdx|stories.@(ts|tsx))',
    '../src/screens/**/*.@(mdx|stories.@(ts|tsx))',
  ],
  addons: ['@storybook/addon-docs'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.js',
    ]
    return config
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
}
