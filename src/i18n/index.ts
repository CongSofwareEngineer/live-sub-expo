import type { UiLang } from '@/stores/settings-store';

import en from './en.json';
import vn from './vn.json';

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TranslationKey = Leaves<typeof vn>;
export type TranslateVars = Record<string, string | number>;

// Typed as vn shape → tsc fails if en.json misses a key
const dictionaries: Record<UiLang, typeof vn> = { vi: vn, en };

export const LOCALES: Record<UiLang, string> = { vi: 'vi-VN', en: 'en-US' };

// Resolve dot key, then fill {var} placeholders
export function translate(
  lang: UiLang,
  key: TranslationKey,
  vars?: TranslateVars,
  defaultMessage?: string,
): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
      dictionaries[lang],
    );
  const text = typeof value === 'string' ? value : (defaultMessage ?? key);
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
