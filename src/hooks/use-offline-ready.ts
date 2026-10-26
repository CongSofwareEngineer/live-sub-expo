import { useLanguagePackStore } from '@/stores/language-pack-store';
import { useSettingsStore } from '@/stores/settings-store';

// Offline needs selected whisper model + ML Kit EN & VI packs
export function useOfflineReady() {
  const model = useSettingsStore((s) => s.whisperModel);
  const whisper = useLanguagePackStore((s) => s.whisper[model]?.status);
  const en = useLanguagePackStore((s) => s.translation.en?.status);
  const vi = useLanguagePackStore((s) => s.translation.vi?.status);
  return whisper === 'downloaded' && en === 'downloaded' && vi === 'downloaded';
}
