import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Share, View } from 'react-native';

import { ShareIcon } from '@/components/Icons/share';
import { TrashIcon } from '@/components/Icons/trash';
import { SegmentItem } from '@/components/segment-item';
import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import { useHistoryStore } from '@/stores/history-store';
import { formatDateTime, formatDuration } from '@/utils/format';
import { toSrt, toTxt } from '@/utils/srt';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { translate, locale } = useLanguage();
  const theme = useTheme();
  const meta = useHistoryStore((s) => s.sessions.find((x) => x.id === id));
  const getSegments = useHistoryStore((s) => s.getSegments);
  const remove = useHistoryStore((s) => s.remove);
  // Segments read once from MMKV key session:<id>
  const [segments] = useState(() => getSegments(id));
  const [query, setQuery] = useState('');

  if (!meta) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <AppText variant="heading">{translate('history.notFound')}</AppText>
      </View>
    );
  }

  const title = formatDateTime(meta.startedAt, locale);
  const q = query.trim().toLowerCase();
  const visible = q
    ? segments.filter(
        (s) => s.original.toLowerCase().includes(q) || s.translated?.toLowerCase().includes(q),
      )
    : segments;

  // Phase 1: share as text; file export (expo-file-system) can come later
  const exportAs = (format: 'txt' | 'srt') => {
    const message = format === 'srt' ? toSrt(segments, meta.startedAt) : toTxt(segments);
    void Share.share({ title: `${translate('common.appName')} ${title}.${format}`, message });
  };

  const confirmDelete = () => {
    Alert.alert(translate('history.deleteTitle'), translate('history.deleteMessage'), [
      { text: translate('common.cancel'), style: 'cancel' },
      {
        text: translate('common.delete'),
        style: 'destructive',
        onPress: () => {
          remove(meta.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ title }} />
      <FlatList
        data={visible}
        keyExtractor={(seg) => String(seg.id)}
        renderItem={({ item }) => <SegmentItem segment={item} />}
        contentContainerClassName="gap-1 px-4 pb-10"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="gap-3 py-3">
            <AppText variant="caption">
              {`${meta.sourceLabel ?? translate(`source.${meta.source}`)} · ${formatDuration(meta.endedAt - meta.startedAt)} · ${translate('history.segments', { count: meta.segmentCount })}`}
            </AppText>
            <View className="flex-row gap-2">
              <Button
                className="flex-1"
                variant="secondary"
                icon={<ShareIcon size={16} />}
                label={translate('history.exportTxt')}
                onPress={() => {
                  exportAs('txt');
                }}
              />
              <Button
                className="flex-1"
                variant="secondary"
                icon={<ShareIcon size={16} />}
                label={translate('history.exportSrt')}
                onPress={() => {
                  exportAs('srt');
                }}
              />
            </View>
            <TextField
              value={query}
              onChangeText={setQuery}
              placeholder={translate('history.searchInSession')}
              accessibilityLabel={translate('history.searchInSession')}
            />
          </View>
        }
        ListEmptyComponent={
          <AppText variant="caption" className="py-8 text-center">
            {translate('history.noMatch')}
          </AppText>
        }
        ListFooterComponent={
          <Button
            className="mt-6"
            variant="ghost"
            icon={<TrashIcon size={16} color={theme.danger} />}
            label={translate('common.delete')}
            onPress={confirmDelete}
          />
        }
      />
    </View>
  );
}
