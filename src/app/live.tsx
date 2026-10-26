import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, View } from 'react-native';

import { StopIcon } from '@/components/Icons/stop';
import { PartialLine, SegmentItem } from '@/components/segment-item';
import { StatusPill } from '@/components/status-pill';
import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { stopSession } from '@/engine/pipeline';
import type { Segment } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';
import { useSessionStore } from '@/stores/session-store';
import { formatMs } from '@/utils/format';

export default function LiveScreen() {
  const { translate } = useLanguage();
  const listRef = useRef<FlatList<Segment>>(null);
  const segments = useSessionStore((s) => s.segments);
  const partial = useSessionStore((s) => s.partial);
  const status = useSessionStore((s) => s.status);
  const connection = useSessionStore((s) => s.connection);
  const lastLatency = useSessionStore((s) => s.latency.last);
  const error = useSessionStore((s) => s.error);

  // Stop → open saved session (if any), else go back
  const onStop = async () => {
    const id = await stopSession();
    if (id) router.replace({ pathname: '/history/[id]', params: { id } });
    else router.back();
  };

  if (status === 'error') {
    return (
      <View className="flex-1 justify-center gap-3 bg-white p-6 dark:bg-black">
        <AppText variant="heading">{translate('live.errorTitle')}</AppText>
        <AppText variant="caption">{error ?? translate('common.error')}</AppText>
        <Button
          label={translate('common.done')}
          onPress={() => {
            router.back();
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between px-4 py-2">
        <StatusPill status={connection} />
        <AppText variant="caption">
          {translate('live.latency')}: {formatMs(lastLatency?.totalMs)}
        </AppText>
      </View>

      <FlatList
        ref={listRef}
        data={segments}
        keyExtractor={(seg) => String(seg.id)}
        renderItem={({ item }) => <SegmentItem segment={item} />}
        contentContainerClassName="px-4 pb-6"
        onContentSizeChange={() => {
          listRef.current?.scrollToEnd({ animated: true });
        }}
        ListFooterComponent={
          partial ? (
            <PartialLine text={partial} />
          ) : segments.length === 0 ? (
            <AppText variant="caption" className="py-6 text-center">
              {translate('live.listening')}
            </AppText>
          ) : undefined
        }
      />

      <View className="px-4 pb-8 pt-2">
        <Button
          size="lg"
          variant="danger"
          icon={<StopIcon size={20} color="#fff" />}
          label={status === 'stopping' ? translate('live.stopping') : translate('live.stop')}
          loading={status === 'stopping'}
          disabled={status === 'idle'}
          onPress={() => {
            void onStop();
          }}
        />
      </View>
    </View>
  );
}
