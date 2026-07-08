'use client';

import { useState, useCallback, useEffect } from 'react';

export type Locale = 'id' | 'en';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function setLocaleCookie(locale: Locale): void {
  document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

export function useLocale(): {
  locale: Locale;
  toggleLocale: () => void;
} {
  // Always default to 'id' so SSR matches client initial render
  const [locale, setLocale] = useState<Locale>('id');

  // After hydration, sync with the actual cookie value
  useEffect(() => {
    const stored = getCookie('locale');
    if (stored === 'en' || stored === 'id') {
      setLocale(stored);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === 'id' ? 'en' : 'id';
      setLocaleCookie(next);
      return next;
    });
    window.location.reload();
  }, []);

  return { locale, toggleLocale };
}
