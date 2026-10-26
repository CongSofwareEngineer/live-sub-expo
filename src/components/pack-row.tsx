import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { DownloadIcon } from '@/components/Icons/download';
import { TrashIcon } from '@/components/Icons/trash';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AppText } from '@/components/ui/text';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import type { PackState } from '@/stores/language-pack-store';

type PackRowProps = {
  title: string;
  subtitle: string;
  pack?: PackState;
  onDownload: () => void;
  onDelete: () => void;
  /** Extra action (e.g. "use this model") */
  accessory?: ReactNode;
};

export function PackRow({ title, subtitle, pack, onDownload, onDelete, accessory }: PackRowProps) {
  const { translate } = useLanguage();
  const theme = useTheme();
  const status = pack?.status ?? 'idle';

  return (
    <View className="gap-2 py-2">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-0.5">
          <AppText>{title}</AppText>
          <AppText variant="caption">
            {status === 'error' ? translate('packs.failed') : subtitle}
          </AppText>
        </View>
        {accessory}
        {status === 'downloading' ? (
          <AppText variant="caption">
            {translate('packs.downloading', { progress: Math.round((pack?.progress ?? 0) * 100) })}
          </AppText>
        ) : status === 'downloaded' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${translate('common.delete')} ${title}`}
            onPress={onDelete}
            className="p-2 active:opacity-60">
            <TrashIcon size={18} color={theme.danger} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${translate('packs.download')} ${title}`}
            onPress={onDownload}
            className="p-2 active:opacity-60">
            <DownloadIcon size={20} color={theme.primary} />
          </Pressable>
        )}
      </View>
      {status === 'downloading' ? <ProgressBar progress={pack?.progress ?? 0} /> : null}
    </View>
  );
}
