import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys, zustandStorage } from '@/lib/storage';

export type Orientation = 'portrait' | 'landscape';

/** Normalized to screen size (0..1) so it survives resolution changes. */
export type OverlayPosition = { x: number; y: number; width: number };

export type OverlayStyle = {
  fontSize: number;
  textColor: string;
  bgColor: string;
  bgOpacity: number;
  maxLines: number;
  showOriginal: boolean;
};

export const OVERLAY_STYLE_LIMITS = {
  fontSize: { min: 12, max: 32, step: 1 },
  bgOpacity: { min: 0, max: 1, step: 0.1 },
  maxLines: { min: 1, max: 5, step: 1 },
} as const;

export const OVERLAY_TEXT_COLORS = ['#FFFFFF', '#FFE066', '#7CF5A2', '#000000'];
export const OVERLAY_BG_COLORS = ['#000000', '#1F2A44', '#FFFFFF'];

export const DEFAULT_OVERLAY_STYLE: OverlayStyle = {
  fontSize: 18,
  textColor: '#FFFFFF',
  bgColor: '#000000',
  bgOpacity: 0.6,
  maxLines: 2,
  showOriginal: true,
};

const DEFAULT_POSITION: Record<Orientation, OverlayPosition> = {
  portrait: { x: 0.05, y: 0.75, width: 0.9 },
  landscape: { x: 0.15, y: 0.8, width: 0.7 },
};

type OverlayState = {
  enabled: boolean;
  position: Record<Orientation, OverlayPosition>;
  style: OverlayStyle;
};

type OverlayActions = {
  setEnabled: (enabled: boolean) => void;
  setPosition: (orientation: Orientation, pos: OverlayPosition) => void;
  setStyle: (patch: Partial<OverlayStyle>) => void;
  resetStyle: () => void;
};

export const useOverlayStore = create<OverlayState & OverlayActions>()(
  persist(
    (set) => ({
      enabled: false,
      position: DEFAULT_POSITION,
      style: DEFAULT_OVERLAY_STYLE,
      setEnabled: (enabled) => {
        set({ enabled });
      },
      setPosition: (orientation, pos) => {
        set((s) => ({ position: { ...s.position, [orientation]: pos } }));
      },
      setStyle: (patch) => {
        set((s) => ({ style: { ...s.style, ...patch } }));
      },
      resetStyle: () => {
        set({ style: DEFAULT_OVERLAY_STYLE });
      },
    }),
    { name: StorageKeys.overlay, storage: createJSONStorage(() => zustandStorage) },
  ),
);
