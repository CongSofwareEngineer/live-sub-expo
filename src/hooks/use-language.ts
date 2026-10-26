import { LOCALES, translate as t, type TranslateVars, type TranslationKey } from '@/i18n';
import { useSettingsStore, type UiLang } from '@/stores/settings-store';

// UI strings in current app language (VI/EN)
export function useLanguage() {
  const lang = useSettingsStore((s) => s.uiLang);
  const update = useSettingsStore((s) => s.update);

  return {
    lang,
    locale: LOCALES[lang],
    setLanguage: (uiLang: UiLang) => {
      update({ uiLang });
    },
    translate: (key: TranslationKey, variables?: TranslateVars, defaultMessage?: string) =>
      t(lang, key, variables, defaultMessage),
  };
}
