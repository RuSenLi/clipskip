import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')
export const storageTheme = useWebExtensionStorage<'light' | 'dark'>('webext-theme', 'light')
