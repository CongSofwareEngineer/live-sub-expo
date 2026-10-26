import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useLanguage } from '@/hooks/use-language';
import type { ConnectionStatus } from '@/stores/session-store';
import { cn } from '@/utils/cn';

const DOT: Record<ConnectionStatus, string> = {
  connected: 'bg-success',
  connecting: 'bg-warning',
  reconnecting: 'bg-warning',
  disconnected: 'bg-danger',
};

export function StatusPill({ status }: { status: ConnectionStatus }) {
  const { translate } = useLanguage();
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1 dark:bg-surface-dark">
      <View className={cn('h-2 w-2 rounded-full', DOT[status])} />
      <AppText className="text-xs">{translate(`live.status.${status}`)}</AppText>
    </View>
  );
}
