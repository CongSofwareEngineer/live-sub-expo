import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useCloudCredential, useSaveApiKey } from '@/api/cloud-credential';
import { CheckIcon } from '@/components/Icons/check';
import { GlobeIcon } from '@/components/Icons/globe';
import { LayersIcon } from '@/components/Icons/layers';
import { SpeedIcon } from '@/components/Icons/speed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Segmented } from '@/components/ui/segmented';
import { Stepper } from '@/components/ui/stepper';
import { AppText } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { ToggleRow } from '@/components/ui/toggle-row';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import {
  CLOUD_PROVIDERS,
  SEGMENTATION_LIMITS,
  useSettingsStore,
  type CloudProvider,
  type ThemePref,
  type UiLang,
} from '@/stores/settings-store';

const MIN_API_KEY_LENGTH = 8;

// API key form (TanStack Form); remounted per provider via `key`
function ApiKeyForm({ provider, initial }: { provider: CloudProvider; initial: string }) {
  const { translate } = useLanguage();
  const save = useSaveApiKey();
  const providerName = translate(`settings.providers.${provider}`);

  const form = useForm({
    defaultValues: { apiKey: initial },
    onSubmit: async ({ value }) => {
      const saved = await save.mutateAsync({ provider, apiKey: value.apiKey });
      // New baseline → isDirty false → "saved" label
      form.reset({ apiKey: saved });
    },
  });

  return (
    <View className="gap-2">
      <form.Field
        name="apiKey"
        validators={{
          onSubmit: ({ value }) =>
            value.trim() && value.trim().length < MIN_API_KEY_LENGTH
              ? translate('settings.apiKeyTooShort')
              : undefined,
        }}>
        {(field) => (
          <>
            <TextField
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder={translate('settings.apiKeyPlaceholder', { provider: providerName })}
              accessibilityLabel={translate('settings.apiKey')}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            {field.state.meta.errors.length > 0 ? (
              <AppText className="text-sm text-danger">
                {field.state.meta.errors.join(', ')}
              </AppText>
            ) : null}
          </>
        )}
      </form.Field>
      <AppText variant="caption">{translate('settings.apiKeyHint')}</AppText>
      <form.Subscribe selector={(s) => [s.isSubmitting, s.isDirty] as const}>
        {([isSubmitting, isDirty]) => (
          <Button
            label={
              save.isSuccess && !isDirty
                ? translate('settings.apiKeySaved')
                : translate('common.save')
            }
            loading={isSubmitting}
            disabled={!isDirty}
            onPress={() => {
              void form.handleSubmit();
            }}
          />
        )}
      </form.Subscribe>
    </View>
  );
}

export default function SettingsScreen() {
  const { translate, lang, setLanguage } = useLanguage();
  const themeColors = useTheme();
  const settings = useSettingsStore();
  const credential = useCloudCredential(settings.cloudProvider);

  return (
    <Screen safeTop>
      <AppText variant="title">{translate('settings.title')}</AppText>

      <Section title={translate('settings.cloud')}>
        <Card>
          <AppText variant="heading">{translate('settings.provider')}</AppText>
          {CLOUD_PROVIDERS.map((p) => (
            <ListRow
              key={p}
              title={translate(`settings.providers.${p}`)}
              selected={settings.cloudProvider === p}
              right={
                settings.cloudProvider === p ? (
                  <CheckIcon size={16} color={themeColors.primary} />
                ) : (
                  <View />
                )
              }
              onPress={() => {
                settings.update({ cloudProvider: p });
              }}
            />
          ))}
          <AppText variant="heading">{translate('settings.apiKey')}</AppText>
          {credential.isPending ? (
            <ActivityIndicator />
          ) : (
            <ApiKeyForm
              key={settings.cloudProvider}
              provider={settings.cloudProvider}
              initial={credential.data ?? ''}
            />
          )}
        </Card>
      </Section>

      <Section title={translate('settings.segmentation')}>
        <Card>
          <Stepper
            label={translate('settings.silenceMs')}
            hint={translate('settings.silenceHint')}
            value={settings.segmentation.silenceMs}
            display={translate('common.ms', { value: settings.segmentation.silenceMs })}
            {...SEGMENTATION_LIMITS.silenceMs}
            onChange={(silenceMs) => {
              settings.setSegmentation({ silenceMs });
            }}
          />
          <Stepper
            label={translate('settings.maxWords')}
            value={settings.segmentation.maxWords}
            display={translate('settings.maxWordsValue', { value: settings.segmentation.maxWords })}
            {...SEGMENTATION_LIMITS.maxWords}
            onChange={(maxWords) => {
              settings.setSegmentation({ maxWords });
            }}
          />
        </Card>
      </Section>

      <Section title={translate('settings.downloads')}>
        <Card>
          <ToggleRow
            label={translate('settings.wifiOnly')}
            value={settings.wifiOnly}
            onChange={(wifiOnly) => {
              settings.update({ wifiOnly });
            }}
          />
        </Card>
      </Section>

      <Section title={translate('settings.appearance')}>
        <Card>
          <AppText>{translate('settings.theme')}</AppText>
          <Segmented<ThemePref>
            options={[
              { value: 'system', label: translate('settings.themeSystem') },
              { value: 'light', label: translate('settings.themeLight') },
              { value: 'dark', label: translate('settings.themeDark') },
            ]}
            value={settings.theme}
            onChange={(theme) => {
              settings.update({ theme });
            }}
          />
          <AppText>{translate('settings.uiLang')}</AppText>
          <Segmented<UiLang>
            options={[
              { value: 'vi', label: translate('languages.vi') },
              { value: 'en', label: translate('languages.en') },
            ]}
            value={lang}
            onChange={setLanguage}
          />
        </Card>
      </Section>

      <Section title={translate('settings.tools')}>
        <Card className="gap-1">
          <ListRow
            title={translate('settings.languagePacks')}
            icon={<GlobeIcon size={18} color={themeColors.textSecondary} />}
            onPress={() => {
              router.push('/language-packs');
            }}
          />
          <ListRow
            title={translate('settings.overlay')}
            icon={<LayersIcon size={18} color={themeColors.textSecondary} />}
            onPress={() => {
              router.push('/overlay-editor');
            }}
          />
          <ListRow
            title={translate('settings.debug')}
            icon={<SpeedIcon size={18} color={themeColors.textSecondary} />}
            onPress={() => {
              router.push('/debug');
            }}
          />
        </Card>
      </Section>

      <Button
        variant="ghost"
        label={translate('settings.redoOnboarding')}
        onPress={() => {
          settings.update({ onboarded: false });
        }}
      />
    </Screen>
  );
}
