import type { Segment } from '@/engine/types';

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

// ms offset → SRT timestamp HH:MM:SS,mmm
export const toSrtTime = (ms: number) => {
  const t = Math.max(0, Math.round(ms));
  const h = Math.floor(t / 3_600_000);
  const m = Math.floor((t % 3_600_000) / 60_000);
  const s = Math.floor((t % 60_000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(t % 1000, 3)}`;
};

const MIN_CUE_MS = 1000;

// Build SRT cues relative to session start; each cue shows translation over original
export function toSrt(segments: Segment[], sessionStartedAt: number): string {
  return segments
    .map((seg, i) => {
      const start = seg.startedAt - sessionStartedAt;
      const next = segments.at(i + 1);
      const rawEnd = seg.committedAt ?? seg.startedAt;
      const end = Math.max(rawEnd - sessionStartedAt, start + MIN_CUE_MS);
      // Don't overlap the next cue
      const capped = next ? Math.min(end, next.startedAt - sessionStartedAt) : end;
      const lines = [seg.translated, seg.original].filter(Boolean).join('\n');
      return `${i + 1}\n${toSrtTime(start)} --> ${toSrtTime(Math.max(capped, start))}\n${lines}\n`;
    })
    .join('\n');
}

// Plain bilingual transcript
export const toTxt = (segments: Segment[]) =>
  segments.map((seg) => [seg.original, seg.translated].filter(Boolean).join('\n')).join('\n\n');
