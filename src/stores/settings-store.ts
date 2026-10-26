import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Direction, EngineMode, SegmentationOptions } from '@/engine/types';
import { StorageKeys, zustandStorage } from '@/lib/storage';

export type CloudProvider = 'deepgram' | 'soniox' | 'openai' | 'azure';
export type WhisperModel = 'tiny' | 'base' | 'small';
export type ThemePref = 'system' | 'light' | 'dark';
export type UiLang = 'vi' | 'en';

export const CLOUD_PROVIDERS: CloudProvider[] = ['deepgram', 'soniox', 'openai', 'azure'];
export const WHISPER_MODELS: WhisperModel[] = ['tiny', 'base', 'small'];

export const SEGMENTATION_LIMITS = {
  silenceMs: { min: 300, max: 1000, step: 50 },
  maxWords: { min: 6, max: 20, step: 1 },
} as const;

type SettingsState = {
  direction: Direction;
  engine: EngineMode;
  cloudProvider: CloudProvider;
  whisperModel: WhisperModel;
  segmentation: SegmentationOptions;
  theme: ThemePref;
  uiLang: UiLang;
  wifiOnly: boolean;
  onboarded: boolean;
};

type SettingsActions = {
  update: (patch: Partial<SettingsState>) => void;
  setSegmentation: (patch: Partial<SegmentationOptions>) => void;
};

// Default UI language from device locale
const deviceLang = (): UiLang =>
  Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith('vi') ? 'vi' : 'en';

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      direction: 'en-vi',
      engine: 'cloud',
      cloudProvider: 'deepgram',
      whisperModel: 'base',
      segmentation: { silenceMs: 400, maxWords: 12 },
      theme: 'system',
      uiLang: deviceLang(),
      wifiOnly: true,
      onboarded: false,
      update: (patch) => {
        set(patch);
      },
      setSegmentation: (patch) => {
        set((s) => ({ segmentation: { ...s.segmentation, ...patch } }));
      },
    }),
    { name: StorageKeys.settings, storage: createJSONStorage(() => zustandStorage) },
  ),
);
