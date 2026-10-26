import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/api/query-keys';
import type { WhisperModel } from '@/stores/settings-store';

export type TranslationPackInfo = { code: string; sizeMb: number; required: boolean };
export type WhisperModelInfo = { id: WhisperModel; sizeMb: number };

export type LanguageCatalog = {
  translation: TranslationPackInfo[];
  whisper: WhisperModelInfo[];
};

// Phase 1 mock catalog; sizes ≈ ML Kit packs / whisper.cpp q5 models
const MOCK_CATALOG: LanguageCatalog = {
  translation: [
    { code: 'en', sizeMb: 30, required: true },
    { code: 'vi', sizeMb: 30, required: true },
    { code: 'ja', sizeMb: 30, required: false },
    { code: 'ko', sizeMb: 30, required: false },
    { code: 'zh', sizeMb: 30, required: false },
    { code: 'fr', sizeMb: 30, required: false },
    { code: 'de', sizeMb: 30, required: false },
    { code: 'es', sizeMb: 30, required: false },
    { code: 'th', sizeMb: 30, required: false },
  ],
  whisper: [
    { id: 'tiny', sizeMb: 32 },
    { id: 'base', sizeMb: 60 },
    { id: 'small', sizeMb: 190 },
  ],
};

// TODO(phase 4): fetch real catalog from backend / CDN
export function useLanguageCatalog() {
  return useQuery({
    queryKey: QUERY_KEYS.languageCatalog,
    queryFn: () =>
      new Promise<LanguageCatalog>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_CATALOG);
        }, 300);
      }),
  });
}
