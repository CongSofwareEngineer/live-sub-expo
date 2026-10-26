import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { QUERY_KEYS } from '@/api/query-keys';
import { MOCK_CAPTURABLE_APPS } from '@/engine/mock-data';

// TODO(phase 3): modules/audio-capture listCapturableApps() (Android only)
export function useCapturableApps() {
  return useQuery({
    queryKey: QUERY_KEYS.capturableApps,
    queryFn: () => Promise.resolve(MOCK_CAPTURABLE_APPS),
    enabled: Platform.OS === 'android',
  });
}
