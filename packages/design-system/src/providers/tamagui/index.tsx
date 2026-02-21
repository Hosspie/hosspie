import { TamaguiProvider as TamaguiProviderOG } from 'tamagui'
import config from '../../config/tamagui.config'

export function TamaguiProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark'
}) {
  return (
    <TamaguiProviderOG config={config} defaultTheme={defaultTheme}>
      {children}
    </TamaguiProviderOG>
  )
}
