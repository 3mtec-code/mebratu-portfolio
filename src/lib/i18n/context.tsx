'use client'

import { createContext, useContext, useCallback } from 'react'
import { defaultTranslations, TranslationKey } from './translations'

interface I18nContextValue {
    locale: 'en'
    setLocale: (l: 'en') => void
    t: (key: TranslationKey, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue>({
    locale: 'en',
    setLocale: () => { },
    t: (key) => defaultTranslations.en[key] ?? key,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const t = useCallback((key: TranslationKey, fallback?: string): string => {
        return defaultTranslations.en[key] ?? fallback ?? key
    }, [])

    return (
        <I18nContext.Provider value={{ locale: 'en', setLocale: () => { }, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    return useContext(I18nContext)
}
