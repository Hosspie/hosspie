import React from 'react'
import type { Preview } from '@storybook/react'

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          minHeight: '100vh',
          backgroundColor: '#080808',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
