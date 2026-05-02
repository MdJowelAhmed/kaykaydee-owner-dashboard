const STORAGE_KEY = 'kaykaydee-ui-theme' as const

export type ThemeMode = 'light' | 'dark'

/** Safe read for Redux initial state + main.tsx bootstrap */
export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function persistTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}
