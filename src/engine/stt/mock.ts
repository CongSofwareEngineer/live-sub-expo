import { MOCK_SENTENCES } from '@/engine/mock-data';
import type { FinalSegment, LangCode, SttEngine } from '@/engine/types';

const WORD_MS = 220;
const PAUSE_AFTER_COMMA_MS = 650;
const PAUSE_BETWEEN_SENTENCES_MS = 900;

// Fake streaming STT: replays MOCK_SENTENCES word by word as cumulative partials
export function createMockStt(): SttEngine {
  const partialCbs = new Set<(text: string) => void>();
  const finalCbs = new Set<(seg: FinalSegment) => void>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;

  const run = (lang: LangCode | 'auto') => {
    const pool = MOCK_SENTENCES.filter((s) => lang === 'auto' || s.lang === lang);
    let sentenceIdx = 0;
    let wordIdx = 0;

    const tick = () => {
      if (!running) return;
      const sentence = pool[sentenceIdx % pool.length];
      const words = sentence.text.split(' ');
      wordIdx += 1;
      const text = words.slice(0, wordIdx).join(' ');
      partialCbs.forEach((cb) => {
        cb(text);
      });

      if (wordIdx >= words.length) {
        finalCbs.forEach((cb) => {
          cb({ text, lang: sentence.lang });
        });
        sentenceIdx += 1;
        wordIdx = 0;
        timer = setTimeout(tick, PAUSE_BETWEEN_SENTENCES_MS);
        return;
      }
      const delay = text.endsWith(',') ? PAUSE_AFTER_COMMA_MS : WORD_MS;
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, WORD_MS);
  };

  return {
    start({ lang }) {
      running = true;
      run(lang);
      return Promise.resolve();
    },
    pushAudio() {
      // Mock ignores audio
    },
    stop() {
      running = false;
      if (timer) clearTimeout(timer);
      return Promise.resolve();
    },
    onPartial(cb) {
      partialCbs.add(cb);
      return () => {
        partialCbs.delete(cb);
      };
    },
    onFinal(cb) {
      finalCbs.add(cb);
      return () => {
        finalCbs.delete(cb);
      };
    },
  };
}
