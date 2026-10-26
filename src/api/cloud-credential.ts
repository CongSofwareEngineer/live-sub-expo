import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/api/query-keys';
import { getSecureStorage, StorageKeys } from '@/lib/storage';
import type { CloudProvider } from '@/stores/settings-store';

// MVP: user's own API key from encrypted MMKV
// TODO(phase 6): fetch short-lived token from NestJS backend instead
export function useCloudCredential(provider: CloudProvider) {
  return useQuery({
    queryKey: QUERY_KEYS.cloudCredential(provider),
    queryFn: () => getSecureStorage().getString(StorageKeys.apiKey(provider)) ?? null,
    staleTime: Infinity,
  });
}

export function useSaveApiKey() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ provider, apiKey }: { provider: CloudProvider; apiKey: string }) => {
      const trimmed = apiKey.trim();
      const secure = getSecureStorage();
      if (trimmed) secure.set(StorageKeys.apiKey(provider), trimmed);
      else secure.remove(StorageKeys.apiKey(provider));
      return Promise.resolve(trimmed);
    },
    onSuccess: (_, { provider }) =>
      client.invalidateQueries({ queryKey: QUERY_KEYS.cloudCredential(provider) }),
  });
}
