import { ActivityIndicator, View } from 'react-native';

import { useCapturableApps } from '@/api/capturable-apps';
import { AppsIcon } from '@/components/Icons/apps';
import { CheckIcon } from '@/components/Icons/check';
import { ListRow } from '@/components/ui/list-row';
import { AppText } from '@/components/ui/text';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import type { CapturableApp } from '@/stores/session-store';

type AppPickerProps = { value?: CapturableApp; onChange: (app: CapturableApp) => void };

// Android: choose which app's audio to capture
export function AppPicker({ value, onChange }: AppPickerProps) {
  const { translate } = useLanguage();
  const theme = useTheme();
  const { data, isPending, isError } = useCapturableApps();

  if (isPending) return <ActivityIndicator />;
  if (isError) return <AppText variant="caption">{translate('common.error')}</AppText>;

  return (
    <View className="gap-1">
      <AppText variant="caption">{translate('source.chooseApp')}</AppText>
      {data.map((app) => {
        const selected = app.packageName === value?.packageName;
        return (
          <ListRow
            key={app.packageName}
            title={app.label}
            subtitle={app.packageName}
            icon={<AppsIcon size={18} color={theme.textSecondary} />}
            selected={selected}
            right={selected ? <CheckIcon size={16} color={theme.primary} /> : <View />}
            onPress={() => {
              onChange(app);
            }}
          />
        );
      })}
    </View>
  );
}
