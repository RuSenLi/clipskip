import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { ComboboxOption } from '~/components/types'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')
export const storageTheme = useWebExtensionStorage<'light' | 'dark'>('webext-theme', 'light')
export const storageSelectedUrl = useWebExtensionStorage<string>('webext-selectedUrl', '')
export const storageSelectedLabel = useWebExtensionStorage<string>('webext-selectedLabel', '')
export const storageComboboxOptions = useWebExtensionStorage<ComboboxOption[]>('webext-ComboboxOptions', [{ label: 'current page', value: '' }])
