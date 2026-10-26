import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AudioSource, Direction, EngineMode, Segment } from '@/engine/types';
import { storage, StorageKeys, zustandStorage } from '@/lib/storage';

export type HistorySessionMeta = {
  id: string;
  startedAt: number;
  endedAt: number;
  source: AudioSource;
  sourceLabel?: string;
  direction: Direction;
  engine: EngineMode;
  segmentCount: number;
  /** First translated line, for list preview & search */
  preview: string;
};

type HistoryState = {
  /** Index only, newest first. Segments live in MMKV key `session:<id>` */
  sessions: HistorySessionMeta[];
};

type HistoryActions = {
  save: (meta: HistorySessionMeta, segments: Segment[]) => void;
  remove: (id: string) => void;
  getSegments: (id: string) => Segment[];
};

export const useHistoryStore = create<HistoryState & HistoryActions>()(
  persist(
    (set) => ({
      sessions: [],
      save: (meta, segments) => {
        storage.set(StorageKeys.session(meta.id), JSON.stringify(segments));
        set((s) => ({ sessions: [meta, ...s.sessions.filter((x) => x.id !== meta.id)] }));
      },
      remove: (id) => {
        storage.remove(StorageKeys.session(id));
        set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }));
      },
      // Read one session's segments from its own key
      getSegments: (id) => {
        const raw = storage.getString(StorageKeys.session(id));
        if (!raw) return [];
        try {
          return JSON.parse(raw) as Segment[];
        } catch {
          return [];
        }
      },
    }),
    {
      name: StorageKeys.historyIndex,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ sessions: s.sessions }),
    },
  ),
);
