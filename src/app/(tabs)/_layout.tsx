import { NativeTabs } from 'expo-router/native-tabs';

import { SYMBOLS } from '@/components/Icons/symbols';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const { translate } = useLanguage();
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundElement}
      labelStyle={{ selected: { color: theme.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{translate('tabs.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={SYMBOLS.home.ios} md={SYMBOLS.home.android} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>{translate('tabs.history')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={SYMBOLS.history.ios} md={SYMBOLS.history.android} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{translate('tabs.settings')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={SYMBOLS.settings.ios} md={SYMBOLS.settings.android} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
