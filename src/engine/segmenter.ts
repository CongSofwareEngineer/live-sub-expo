import type { LangCode, SegmentationOptions } from '@/engine/types';

export type CommitReason = 'punctuation' | 'silence' | 'max-words' | 'final';

export type Chunk = {
  text: string;
  reason: CommitReason;
  /** Time the first word of this chunk was seen */
  startedAt: number;
  /** Only known when committed from an STT final */
  lang?: LangCode;
};

export type Segmenter = {
  pushPartial(text: string): void;
  pushFinal(text: string, lang: LangCode): void;
  /** Uncommitted words of the current utterance (shown as partial) */
  getPending(): string;
  flush(): void;
  dispose(): void;
};

const SENTENCE_END = /[.?!…;:]$/;

const splitWords = (text: string) => text.trim().split(/\s+/).filter(Boolean);

// "Translate early": cut STT stream into chunks on punctuation / silence / max words
export function createSegmenter(
  opts: SegmentationOptions,
  onCommit: (chunk: Chunk) => void,
  now: () => number = Date.now,
): Segmenter {
  // Words of current utterance already committed (frozen even if STT revises them)
  let committed = 0;
  let lastWords: string[] = [];
  let chunkStartedAt: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  const commit = (words: string[], reason: CommitReason, lang?: LangCode) => {
    if (words.length === 0) return;
    committed += words.length;
    onCommit({ text: words.join(' '), reason, startedAt: chunkStartedAt ?? now(), lang });
    chunkStartedAt = undefined;
  };

  const commitPending = (reason: CommitReason) => {
    clearTimer();
    commit(lastWords.slice(committed), reason);
  };

  return {
    pushPartial(text) {
      lastWords = splitWords(text);
      let pending = lastWords.slice(committed);
      if (pending.length === 0) return;
      chunkStartedAt ??= now();

      // Cut at the last sentence-ending word, if any
      const endIdx = pending.findLastIndex((w) => SENTENCE_END.test(w));
      if (endIdx >= 0) {
        commit(pending.slice(0, endIdx + 1), 'punctuation');
        pending = lastWords.slice(committed);
      }

      // Too long without punctuation → cut every maxWords
      while (pending.length >= opts.maxWords) {
        chunkStartedAt ??= now();
        commit(pending.slice(0, opts.maxWords), 'max-words');
        pending = lastWords.slice(committed);
      }

      clearTimer();
      if (pending.length > 0) {
        chunkStartedAt ??= now();
        timer = setTimeout(() => {
          commitPending('silence');
        }, opts.silenceMs);
      }
    },

    pushFinal(text, lang) {
      clearTimer();
      const words = splitWords(text);
      chunkStartedAt ??= now();
      commit(words.slice(committed), 'final', lang);
      committed = 0;
      lastWords = [];
      chunkStartedAt = undefined;
    },

    getPending() {
      return lastWords.slice(committed).join(' ');
    },

    flush() {
      commitPending('final');
      committed = 0;
      lastWords = [];
    },

    dispose() {
      clearTimer();
    },
  };
}
