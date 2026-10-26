import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppsIcon } from '@/components/Icons/apps';
import { MicIcon } from '@/components/Icons/mic';
import { ListRow } from '@/components/ui/list-row';
import { AppText } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import { useHistoryStore, type HistorySessionMeta } from '@/stores/history-store';
import { formatDateTime, formatDuration } from '@/utils/format';

// Match on preview/source first (cheap), then on stored segments
const matches = (
  meta: HistorySessionMeta,
  q: string,
  getSegments: (id: string) => { original: string; translated?: string }[],
) => {
  const has = (s?: string) => s?.toLowerCase().includes(q) ?? false;
  if (has(meta.preview) || has(meta.sourceLabel)) return true;
  return getSegments(meta.id).some((seg) => has(seg.original) || has(seg.translated));
};

export default function HistoryScreen() {
  const { translate, locale } = useLanguage();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sessions = useHistoryStore((s) => s.sessions);
  const getSegments = useHistoryStore((s) => s.getSegments);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const data = q ? sessions.filter((m) => matches(m, q, getSegments)) : sessions;

  return (
    <View
      className="flex-1 gap-3 bg-white px-4 dark:bg-black"
      style={{ paddingTop: insets.top + 16 }}>
      <AppText variant="title">{translate('history.title')}</AppText>
      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder={translate('history.search')}
        accessibilityLabel={translate('history.search')}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-10"
        renderItem={({ item }) => (
          <ListRow
            icon={
              item.source === 'mic' ? (
                <MicIcon size={18} color={theme.textSecondary} />
              ) : (
                <AppsIcon size={18} color={theme.textSecondary} />
              )
            }
            title={`${formatDateTime(item.startedAt, locale)} · ${formatDuration(item.endedAt - item.startedAt)}`}
            subtitle={`${item.sourceLabel ?? translate(`source.${item.source}`)} · ${translate('history.segments', { count: item.segmentCount })}\n${item.preview}`}
            onPress={() => {
              router.push({ pathname: '/history/[id]', params: { id: item.id } });
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center gap-1 py-16">
            <AppText variant="heading">
              {q ? translate('history.noMatch') : translate('history.empty')}
            </AppText>
            {q ? null : <AppText variant="caption">{translate('history.emptyHint')}</AppText>}
          </View>
        }
      />
    </View>
  );
}
