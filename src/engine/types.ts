export type LangCode = 'en' | 'vi';

export type Direction = 'en-vi' | 'vi-en' | 'auto';

export type EngineMode = 'cloud' | 'offline';

export type AudioSource = 'mic' | 'app';

export type Unsubscribe = () => void;

/** PCM 16kHz mono frame (20–100ms). */
export type PcmFrame = {
  data: ArrayBuffer;
  sampleRate: number;
  timestamp: number;
};

export type FinalSegment = { text: string; lang: LangCode };

export interface SttEngine {
  start(opts: { lang: LangCode | 'auto' }): Promise<void>;
  pushAudio(frame: PcmFrame): void;
  stop(): Promise<void>;
  onPartial(cb: (text: string) => void): Unsubscribe;
  onFinal(cb: (seg: FinalSegment) => void): Unsubscribe;
}

export interface Translator {
  translate(text: string, from: LangCode, to: LangCode): Promise<string>;
}

export type Segment = {
  /** Sequence number — display order */
  id: number;
  original: string;
  translated?: string;
  lang: LangCode;
  isPartial: boolean;
  /** First partial of this chunk seen by STT */
  startedAt: number;
  /** Chunk committed by segmenter */
  committedAt?: number;
  translatedAt?: number;
};

export type LatencySample = {
  segmentId: number;
  sttMs: number;
  translateMs: number;
  totalMs: number;
};

export type SegmentationOptions = {
  silenceMs: number;
  maxWords: number;
};
