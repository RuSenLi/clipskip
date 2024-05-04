import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { PageOption, SelectedOption } from '~/components/types'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')
export const storageTheme = useWebExtensionStorage<'light' | 'dark'>('webext-theme', 'light')
export const storageselectedOption = useWebExtensionStorage<SelectedOption>('webext-selectedOption', { url: '', label: '' })
export const storagePageOptions = useWebExtensionStorage<PageOption[]>('webext-pageOptions', [])
