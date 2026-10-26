import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { AppText } from '@/components/ui/text';
import { images } from '@/config/images';
import { useLanguage } from '@/hooks/use-language';
import { useDirectionOptions } from '@/hooks/use-options';
import { useSettingsStore } from '@/stores/settings-store';

// Step 1: intro + default direction
export default function WelcomeScreen() {
  const { translate } = useLanguage();
  const direction = useSettingsStore((s) => s.direction);
  const update = useSettingsStore((s) => s.update);
  const directionOptions = useDirectionOptions();

  return (
    <Screen safeTop className="flex-grow justify-between">
      <View className="items-center gap-4 pt-10">
        <Image source={images.icon} style={{ width: 96, height: 96, borderRadius: 22 }} />
        <AppText variant="title" className="text-center">
          {translate('onboarding.welcomeTitle')}
        </AppText>
        <AppText variant="caption" className="text-center text-base">
          {translate('onboarding.welcomeBody')}
        </AppText>
      </View>

      <Card>
        <AppText variant="heading">{translate('onboarding.chooseDirection')}</AppText>
        <Segmented
          options={directionOptions}
          value={direction}
          onChange={(value) => {
            update({ direction: value });
          }}
        />
      </Card>

      <View className="gap-2">
        <AppText variant="caption" className="text-center">
          {translate('onboarding.step', { current: 1, total: 3 })}
        </AppText>
        <Button
          size="lg"
          label={translate('common.continue')}
          onPress={() => {
            router.push('/mode');
          }}
        />
      </View>
    </Screen>
  );
}
