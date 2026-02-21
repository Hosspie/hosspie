import React from 'react'
import type { Preview } from '@storybook/react'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../src/config/tamagui.config.web'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name="dark">
          <Story />
        </Theme>
      </TamaguiProvider>
    ),
  ],
}

export default preview
