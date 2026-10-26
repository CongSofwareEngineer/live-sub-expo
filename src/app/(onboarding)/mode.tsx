import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { CloudIcon } from '@/components/Icons/cloud';
import { OfflineIcon } from '@/components/Icons/offline';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import type { EngineMode } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/utils/cn';

// Step 2: Cloud (API key later) or Offline (download packs)
export default function ModeScreen() {
  const { translate } = useLanguage();
  const theme = useTheme();
  const engine = useSettingsStore((s) => s.engine);
  const update = useSettingsStore((s) => s.update);

  const options: { value: EngineMode; title: string; desc: string; icon: ReactNode }[] = [
    {
      value: 'cloud',
      title: translate('engine.cloud'),
      desc: translate('onboarding.cloudDesc'),
      icon: <CloudIcon size={26} color={theme.primary} />,
    },
    {
      value: 'offline',
      title: translate('engine.offline'),
      desc: translate('onboarding.offlineDesc'),
      icon: <OfflineIcon size={26} color={theme.primary} />,
    },
  ];

  return (
    <Screen safeTop className="flex-grow">
      <AppText variant="title">{translate('onboarding.modeTitle')}</AppText>
      <View className="gap-3">
        {options.map((opt) => {
          const selected = engine === opt.value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => {
                update({ engine: opt.value });
              }}
              className={cn(
                'flex-row items-center gap-4 rounded-2xl border-2 p-4 active:opacity-70',
                selected
                  ? 'border-primary bg-primary-soft dark:bg-primary-soft-dark'
                  : 'border-surface-2 dark:border-surface-2-dark',
              )}>
              {opt.icon}
              <View className="flex-1 gap-1">
                <AppText variant="heading">{opt.title}</AppText>
                <AppText variant="caption">{opt.desc}</AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {engine === 'cloud' ? (
        <AppText variant="caption">{translate('onboarding.apiKeyLater')}</AppText>
      ) : (
        <Button
          variant="secondary"
          label={translate('engine.managePacks')}
          onPress={() => {
            router.push('/language-packs');
          }}
        />
      )}

      <View className="flex-1" />
      <View className="gap-2">
        <AppText variant="caption" className="text-center">
          {translate('onboarding.step', { current: 2, total: 3 })}
        </AppText>
        <Button
          size="lg"
          label={translate('common.continue')}
          onPress={() => {
            router.push('/permissions');
          }}
        />
      </View>
    </Screen>
  );
}
