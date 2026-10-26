import { View } from 'react-native';

import { LayersIcon } from '@/components/Icons/layers';
import { MicIcon } from '@/components/Icons/mic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';

// Step 3: explain permissions; finishing flips the onboarding guard → tabs
// TODO(phase 2): request RECORD_AUDIO / NSMicrophoneUsage via modules/audio-capture
export default function PermissionsScreen() {
  const { translate } = useLanguage();
  const theme = useTheme();
  const update = useSettingsStore((s) => s.update);

  return (
    <Screen safeTop className="flex-grow">
      <AppText variant="title">{translate('onboarding.permissionsTitle')}</AppText>
      <Card className="flex-row items-start gap-3">
        <MicIcon size={24} color={theme.primary} />
        <AppText className="flex-1">{translate('onboarding.micBody')}</AppText>
      </Card>
      <Card className="flex-row items-start gap-3">
        <LayersIcon size={24} color={theme.primary} />
        <AppText className="flex-1">{translate('onboarding.overlayBody')}</AppText>
      </Card>
      <AppText variant="caption">{translate('onboarding.micNote')}</AppText>

      <View className="flex-1" />
      <View className="gap-2">
        <AppText variant="caption" className="text-center">
          {translate('onboarding.step', { current: 3, total: 3 })}
        </AppText>
        <Button
          size="lg"
          label={translate('onboarding.finish')}
          onPress={() => {
            update({ onboarded: true });
          }}
        />
      </View>
    </Screen>
  );
}
