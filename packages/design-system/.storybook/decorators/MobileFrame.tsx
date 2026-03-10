import React from 'react'
import type { Decorator } from '@storybook/react'

const IPHONE_WIDTH = 375
const IPHONE_HEIGHT = 812

export const MobileFrame: Decorator = (Story) => (
  <div
    style={{
      width: IPHONE_WIDTH,
      height: IPHONE_HEIGHT,
      borderRadius: 40,
      border: '3px solid #333',
      overflow: 'hidden',
      backgroundColor: '#080808',
      position: 'relative',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}
  >
    {/* Status bar area */}
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080808',
      }}
    >
      <div
        style={{
          width: 80,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#000',
        }}
      />
    </div>
    {/* Content area */}
    <div
      style={{
        height: IPHONE_HEIGHT - 44 - 34,
        overflowY: 'auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      <Story />
    </div>
    {/* Home indicator */}
    <div
      style={{
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080808',
      }}
    >
      <div
        style={{
          width: 134,
          height: 5,
          borderRadius: 3,
          backgroundColor: '#333',
        }}
      />
    </div>
  </div>
)
