import { detectLang, otherLang } from '@/engine/detect-lang';
import { createEngines } from '@/engine/factory';
import { createSegmenter, type Chunk, type Segmenter } from '@/engine/segmenter';
import type { Direction, LangCode, SttEngine, Unsubscribe } from '@/engine/types';
import { useHistoryStore } from '@/stores/history-store';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

type ActiveRun = {
  stt: SttEngine;
  segmenter: Segmenter;
  unsubs: Unsubscribe[];
  pending: Set<Promise<void>>;
};

let active: ActiveRun | undefined;

const sttLangFor = (direction: Direction): LangCode | 'auto' =>
  direction === 'en-vi' ? 'en' : direction === 'vi-en' ? 'vi' : 'auto';

const newSessionId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const isSessionActive = () => active !== undefined;

// audio-capture → STT → segmenter → translator → session store (+ overlay in phase 3)
export async function startSession(): Promise<void> {
  if (active) return;
  const { direction, engine, segmentation } = useSettingsStore.getState();
  const session = useSessionStore.getState();
  session.begin({ sessionId: newSessionId(), direction, engine });

  const { stt, translator } = createEngines(engine);
  const sttLang = sttLangFor(direction);
  const pending = new Set<Promise<void>>();
  let nextId = 1;

  const resolveLang = (chunk: Chunk): LangCode =>
    sttLang !== 'auto' ? sttLang : (chunk.lang ?? detectLang(chunk.text));

  // Each chunk gets a sequence id; translations may resolve out of order but display uses id
  const onCommit = (chunk: Chunk) => {
    const id = nextId++;
    const committedAt = Date.now();
    const from = resolveLang(chunk);
    const store = useSessionStore.getState();
    store.addSegment({
      id,
      original: chunk.text,
      lang: from,
      isPartial: false,
      startedAt: chunk.startedAt,
      committedAt,
    });
    store.setPartial(segmenter.getPending());

    const job = translator
      .translate(chunk.text, from, otherLang(from))
      .then((translated) => {
        const now = Date.now();
        useSessionStore.getState().setTranslation(id, translated, {
          segmentId: id,
          sttMs: committedAt - chunk.startedAt,
          translateMs: now - committedAt,
          totalMs: now - chunk.startedAt,
        });
        // TODO(phase 3): push latest line to subtitle-overlay native module
      })
      .catch((e: unknown) => {
        console.warn('[pipeline] translate failed', id, e);
      })
      .finally(() => {
        pending.delete(job);
      });
    pending.add(job);
  };

  const segmenter = createSegmenter(segmentation, onCommit);
  const unsubs = [
    stt.onPartial((text) => {
      segmenter.pushPartial(text);
      useSessionStore.getState().setPartial(segmenter.getPending());
    }),
    stt.onFinal((seg) => {
      segmenter.pushFinal(seg.text, seg.lang);
      useSessionStore.getState().setPartial('');
    }),
  ];
  active = { stt, segmenter, unsubs, pending };

  // TODO(phase 2): start modules/audio-capture and forward frames to stt.pushAudio
  try {
    await stt.start({ lang: sttLang });
    session.setStatus('running');
    session.setConnection('connected');
  } catch (e) {
    teardown();
    session.setConnection('disconnected');
    session.setStatus('error', e instanceof Error ? e.message : String(e));
  }
}

const teardown = () => {
  if (!active) return;
  active.unsubs.forEach((u) => {
    u();
  });
  active.segmenter.dispose();
  active = undefined;
};

// Stop STT, flush last chunk, wait for in-flight translations, then save to history
export async function stopSession(): Promise<string | undefined> {
  const run = active;
  if (!run) return undefined;
  const session = useSessionStore.getState();
  session.setStatus('stopping');

  await run.stt.stop();
  run.segmenter.flush();
  await Promise.allSettled([...run.pending]);
  teardown();

  const s = useSessionStore.getState();
  s.setPartial('');
  s.setConnection('disconnected');
  s.setStatus('idle');

  if (!s.sessionId || !s.startedAt || !s.direction || !s.engine || s.segments.length === 0) {
    return undefined;
  }
  useHistoryStore.getState().save(
    {
      id: s.sessionId,
      startedAt: s.startedAt,
      endedAt: Date.now(),
      source: s.source,
      sourceLabel: s.source === 'app' ? s.targetApp?.label : undefined,
      direction: s.direction,
      engine: s.engine,
      segmentCount: s.segments.length,
      preview: s.segments[0].translated ?? s.segments[0].original,
    },
    s.segments,
  );
  return s.sessionId;
}
