import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys, zustandStorage } from '@/lib/storage';
import type { WhisperModel } from '@/stores/settings-store';

export type PackStatus = 'idle' | 'downloading' | 'downloaded' | 'error';
export type PackState = { status: PackStatus; progress: number };
export type PackKind = 'translation' | 'whisper';

type LanguagePackState = {
  /** ML Kit translation packs, keyed by language code */
  translation: Record<string, PackState | undefined>;
  whisper: Partial<Record<WhisperModel, PackState>>;
};

type LanguagePackActions = {
  setPack: (kind: PackKind, id: string, patch: Partial<PackState>) => void;
  isDownloaded: (kind: PackKind, id: string) => boolean;
};

const IDLE: PackState = { status: 'idle', progress: 0 };

// Interrupted downloads can't resume across launches → back to idle
const resetDownloading = <T extends Record<string, PackState | undefined>>(packs: T): T =>
  Object.fromEntries(
    Object.entries(packs).map(([id, p]) => [id, p?.status === 'downloading' ? IDLE : p]),
  ) as T;

export const useLanguagePackStore = create<LanguagePackState & LanguagePackActions>()(
  persist(
    (set, get) => ({
      translation: {},
      whisper: {},
      setPack: (kind, id, patch) => {
        set((s) => {
          const packs: Record<string, PackState | undefined> = s[kind];
          return { [kind]: { ...packs, [id]: { ...IDLE, ...packs[id], ...patch } } };
        });
      },
      isDownloaded: (kind, id) => {
        const packs: Record<string, PackState | undefined> = get()[kind];
        return packs[id]?.status === 'downloaded';
      },
    }),
    {
      name: StorageKeys.languagePacks,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ translation: s.translation, whisper: s.whisper }),
      merge: (persisted, current) => {
        const p = persisted as Partial<LanguagePackState> | undefined;
        return {
          ...current,
          translation: resetDownloading(p?.translation ?? {}),
          whisper: resetDownloading(p?.whisper ?? {}),
        };
      },
    },
  ),
);
