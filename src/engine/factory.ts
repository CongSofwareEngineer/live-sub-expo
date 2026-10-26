import { createMockStt } from '@/engine/stt/mock';
import { createMockTranslator } from '@/engine/translate/mock';
import type { EngineMode, SttEngine, Translator } from '@/engine/types';

// Pick STT/translator by mode. Phase 1: both modes use mocks
// TODO(phase 2): cloud → src/engine/stt/cloud/*, src/engine/translate/cloud/*
// TODO(phase 4): offline → src/engine/stt/offline/whisper.ts, src/engine/translate/offline/mlkit.ts
export function createEngines(_mode: EngineMode): { stt: SttEngine; translator: Translator } {
  return { stt: createMockStt(), translator: createMockTranslator() };
}
