import { router } from 'expo-router';
import { Platform, View } from 'react-native';

import { useCloudCredential } from '@/api/cloud-credential';
import { AppPicker } from '@/components/app-picker';
import { BroadcastIcon } from '@/components/Icons/broadcast';
import { PlayIcon } from '@/components/Icons/play';
import { TuneIcon } from '@/components/Icons/tune';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { AppText } from '@/components/ui/text';
import { ToggleRow } from '@/components/ui/toggle-row';
import { startSession } from '@/engine/pipeline';
import type { AudioSource, EngineMode } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';
import { useOfflineReady } from '@/hooks/use-offline-ready';
import { useDirectionOptions } from '@/hooks/use-options';
import { useTheme } from '@/hooks/use-theme';
import { useOverlayStore } from '@/stores/overlay-store';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

export default function HomeScreen() {
  const { translate } = useLanguage();
  const theme = useTheme();
  const directionOptions = useDirectionOptions();
  const offlineReady = useOfflineReady();

  const direction = useSettingsStore((s) => s.direction);
  const engine = useSettingsStore((s) => s.engine);
  const cloudProvider = useSettingsStore((s) => s.cloudProvider);
  const update = useSettingsStore((s) => s.update);
  // Granular selectors: avoid re-render on every live partial update
  const source = useSessionStore((s) => s.source);
  const targetApp = useSessionStore((s) => s.targetApp);
  const status = useSessionStore((s) => s.status);
  const setSource = useSessionStore((s) => s.setSource);
  const setTargetApp = useSessionStore((s) => s.setTargetApp);
  const overlayEnabled = useOverlayStore((s) => s.enabled);
  const setOverlayEnabled = useOverlayStore((s) => s.setEnabled);
  const { data: apiKey } = useCloudCredential(cloudProvider);

  const running = status !== 'idle' && status !== 'error';
  const effectiveEngine: EngineMode = engine === 'offline' && !offlineReady ? 'cloud' : engine;
  const needsApp = source === 'app' && Platform.OS === 'android' && !targetApp;

  // Phase 1: start runs mock engines; real capture/permissions arrive in phase 2–3
  const onStart = async () => {
    if (effectiveEngine !== engine) update({ engine: effectiveEngine });
    router.push('/live');
    await startSession();
  };

  return (
    <Screen safeTop>
      <View className="gap-1">
        <AppText variant="title">{translate('common.appName')}</AppText>
        <AppText variant="caption">{translate('home.subtitle')}</AppText>
      </View>

      <Card>
        <AppText variant="heading">{translate('source.title')}</AppText>
        <Segmented<AudioSource>
          options={[
            { value: 'mic', label: translate('source.mic') },
            { value: 'app', label: translate('source.app'), disabled: Platform.OS === 'web' },
          ]}
          value={source}
          onChange={setSource}
        />
        {source === 'app' && Platform.OS === 'android' ? (
          <>
            <AppText variant="caption">{translate('source.appHint')}</AppText>
            <AppPicker value={targetApp} onChange={setTargetApp} />
          </>
        ) : null}
        {source === 'app' && Platform.OS === 'ios' ? (
          <>
            <AppText variant="caption">{translate('source.iosHint')}</AppText>
            <Button
              variant="secondary"
              disabled
              icon={<BroadcastIcon size={18} />}
              label={`${translate('source.iosBroadcast')} · ${translate('common.comingSoon', { phase: 5 })}`}
              onPress={() => undefined}
            />
          </>
        ) : null}
      </Card>

      <Card>
        <AppText variant="heading">{translate('direction.title')}</AppText>
        <Segmented
          options={directionOptions}
          value={direction}
          onChange={(value) => {
            update({ direction: value });
          }}
        />
      </Card>

      <Card>
        <AppText variant="heading">{translate('engine.title')}</AppText>
        <Segmented<EngineMode>
          options={[
            { value: 'cloud', label: translate('engine.cloud') },
            { value: 'offline', label: translate('engine.offline'), disabled: !offlineReady },
          ]}
          value={effectiveEngine}
          onChange={(value) => {
            update({ engine: value });
          }}
        />
        {!offlineReady ? (
          <ListRow
            title={translate('engine.managePacks')}
            subtitle={translate('engine.offlineNotReady')}
            onPress={() => {
              router.push('/language-packs');
            }}
          />
        ) : null}
        {effectiveEngine === 'cloud' && !apiKey ? (
          <ListRow
            title={translate('home.goSettings')}
            subtitle={translate('home.needApiKey', {
              provider: translate(`settings.providers.${cloudProvider}`),
            })}
            onPress={() => {
              router.push('/settings');
            }}
          />
        ) : null}
      </Card>

      <Card>
        {Platform.OS === 'ios' ? (
          <ToggleRow
            label={translate('home.overlay')}
            hint={`${translate('home.overlayIosHint')} · ${translate('common.comingSoon', { phase: 5 })}`}
            value={false}
            disabled
            onChange={() => undefined}
          />
        ) : (
          <ToggleRow
            label={translate('home.overlay')}
            hint={translate('home.overlayHint')}
            value={overlayEnabled}
            onChange={setOverlayEnabled}
          />
        )}
        <ListRow
          title={translate('home.editOverlay')}
          icon={<TuneIcon size={18} color={theme.textSecondary} />}
          onPress={() => {
            router.push('/overlay-editor');
          }}
        />
      </Card>

      {running ? (
        <Button
          size="lg"
          label={translate('home.openLive')}
          onPress={() => {
            router.push('/live');
          }}
        />
      ) : (
        <Button
          size="lg"
          icon={<PlayIcon size={20} color="#fff" />}
          label={translate('home.start')}
          disabled={needsApp}
          onPress={() => {
            void onStart();
          }}
        />
      )}
    </Screen>
  );
}
