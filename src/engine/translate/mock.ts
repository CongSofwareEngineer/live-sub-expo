import { MOCK_SENTENCES } from '@/engine/mock-data';
import type { Translator } from '@/engine/types';

const normalize = (s: string) => s.trim().toLowerCase();

// Fake translator: exact sentence lookup, else tags the chunk; random 150–400ms delay
export function createMockTranslator(): Translator {
  return {
    translate(text, from, to) {
      const hit = MOCK_SENTENCES.find(
        (s) => s.lang === from && normalize(s.text) === normalize(text),
      );
      const result = hit?.translation ?? `[${to}] ${text}`;
      const delay = 150 + Math.random() * 250;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result);
        }, delay);
      });
    },
  };
}
