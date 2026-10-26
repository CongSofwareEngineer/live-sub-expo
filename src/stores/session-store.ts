import { create } from 'zustand';

import type { AudioSource, Direction, EngineMode, LatencySample, Segment } from '@/engine/types';

export type SessionStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'error';
export type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

export type CapturableApp = { packageName: string; label: string };

const MAX_LATENCY_SAMPLES = 100;

type SessionState = {
  status: SessionStatus;
  connection: ConnectionStatus;
  source: AudioSource;
  targetApp?: CapturableApp;
  sessionId?: string;
  startedAt?: number;
  direction?: Direction;
  engine?: EngineMode;
  segments: Segment[];
  /** Uncommitted text of current utterance */
  partial: string;
  latency: { last?: LatencySample; samples: LatencySample[] };
  error?: string;
};

type SessionActions = {
  setSource: (source: AudioSource) => void;
  setTargetApp: (app?: CapturableApp) => void;
  begin: (meta: { sessionId: string; direction: Direction; engine: EngineMode }) => void;
  setStatus: (status: SessionStatus, error?: string) => void;
  setConnection: (connection: ConnectionStatus) => void;
  setPartial: (text: string) => void;
  addSegment: (segment: Segment) => void;
  setTranslation: (id: number, translated: string, sample: LatencySample) => void;
  reset: () => void;
};

const initialRun = {
  status: 'idle' as SessionStatus,
  connection: 'disconnected' as ConnectionStatus,
  sessionId: undefined,
  startedAt: undefined,
  direction: undefined,
  engine: undefined,
  segments: [],
  partial: '',
  latency: { samples: [] },
  error: undefined,
};

// Live session state (not persisted; finished sessions go to history store)
export const useSessionStore = create<SessionState & SessionActions>()((set) => ({
  ...initialRun,
  source: 'mic',
  setSource: (source) => {
    set({ source });
  },
  setTargetApp: (targetApp) => {
    set({ targetApp });
  },
  begin: ({ sessionId, direction, engine }) => {
    set({
      ...initialRun,
      status: 'starting',
      connection: 'connecting',
      sessionId,
      direction,
      engine,
      startedAt: Date.now(),
    });
  },
  setStatus: (status, error) => {
    set({ status, error });
  },
  setConnection: (connection) => {
    set({ connection });
  },
  setPartial: (partial) => {
    set({ partial });
  },
  addSegment: (segment) => {
    set((s) => ({ segments: [...s.segments, segment] }));
  },
  setTranslation: (id, translated, sample) => {
    set((s) => ({
      segments: s.segments.map((seg) =>
        seg.id === id ? { ...seg, translated, translatedAt: Date.now() } : seg,
      ),
      latency: {
        last: sample,
        samples: [...s.latency.samples, sample].slice(-MAX_LATENCY_SAMPLES),
      },
    }));
  },
  reset: () => {
    set(initialRun);
  },
}));
