import { useMutation } from '@tanstack/react-query';

import { useLanguagePackStore, type PackKind } from '@/stores/language-pack-store';

const TICK_MS = 120;

// Fake download: ramps progress into the store. Real version (phase 4):
// whisper → expo-file-system resumable download, translation → ml-translate.downloadModel
const simulateDownload = (kind: PackKind, id: string, sizeMb: number) =>
  new Promise<void>((resolve) => {
    const { setPack } = useLanguagePackStore.getState();
    const step = Math.max(0.02, 3 / sizeMb);
    let progress = 0;
    setPack(kind, id, { status: 'downloading', progress });
    const timer = setInterval(() => {
      progress = Math.min(1, progress + step);
      setPack(kind, id, { progress });
      if (progress >= 1) {
        clearInterval(timer);
        setPack(kind, id, { status: 'downloaded' });
        resolve();
      }
    }, TICK_MS);
  });

export function useDownloadPack() {
  return useMutation({
    mutationFn: ({ kind, id, sizeMb }: { kind: PackKind; id: string; sizeMb: number }) =>
      simulateDownload(kind, id, sizeMb),
    onError: (_, { kind, id }) => {
      useLanguagePackStore.getState().setPack(kind, id, { status: 'error', progress: 0 });
    },
  });
}

// TODO(phase 4): delete model file / ml-translate.deleteModel
export const deletePack = (kind: PackKind, id: string) => {
  useLanguagePackStore.getState().setPack(kind, id, { status: 'idle', progress: 0 });
};
