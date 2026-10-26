import { ActivityIndicator, Alert, Pressable } from 'react-native';

import { useLanguageCatalog } from '@/api/language-catalog';
import { deletePack, useDownloadPack } from '@/api/pack-download';
import { PackRow } from '@/components/pack-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { AppText } from '@/components/ui/text';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/i18n';
import { useLanguagePackStore, type PackKind } from '@/stores/language-pack-store';
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/utils/cn';

export default function LanguagePacksScreen() {
  const { translate } = useLanguage();
  const catalog = useLanguageCatalog();
  const download = useDownloadPack();
  const translationPacks = useLanguagePackStore((s) => s.translation);
  const whisperPacks = useLanguagePackStore((s) => s.whisper);
  const whisperModel = useSettingsStore((s) => s.whisperModel);
  const wifiOnly = useSettingsStore((s) => s.wifiOnly);
  const update = useSettingsStore((s) => s.update);

  // TODO(phase 4): block download on cellular when wifiOnly (expo-network / NetInfo)
  const startDownload = (kind: PackKind, id: string, sizeMb: number) => {
    download.mutate({ kind, id, sizeMb });
  };

  const confirmDelete = (kind: PackKind, id: string, title: string) => {
    Alert.alert(`${translate('common.delete')} ${title}?`, undefined, [
      { text: translate('common.cancel'), style: 'cancel' },
      {
        text: translate('common.delete'),
        style: 'destructive',
        onPress: () => {
          deletePack(kind, id);
        },
      },
    ]);
  };

  if (catalog.isPending) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }
  if (catalog.isError) {
    return (
      <Screen>
        <AppText>{translate('common.error')}</AppText>
        <Button
          label={translate('common.retry')}
          onPress={() => {
            void catalog.refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      {wifiOnly ? <AppText variant="caption">{translate('packs.wifiOnlyNote')}</AppText> : null}

      <Section title={translate('packs.whisper')}>
        <Card className="gap-1">
          {catalog.data.whisper.map((m) => {
            const inUse = whisperModel === m.id;
            const title = `Whisper ${m.id}`;
            return (
              <PackRow
                key={m.id}
                title={title}
                subtitle={`${translate(`packs.model.${m.id}`)} · ${translate('packs.size', { size: m.sizeMb })}`}
                pack={whisperPacks[m.id]}
                onDownload={() => {
                  startDownload('whisper', m.id, m.sizeMb);
                }}
                onDelete={() => {
                  confirmDelete('whisper', m.id, title);
                }}
                accessory={
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: inUse }}
                    onPress={() => {
                      update({ whisperModel: m.id });
                    }}
                    className={cn(
                      'rounded-full px-3 py-1',
                      inUse ? 'bg-primary' : 'bg-surface-2 dark:bg-surface-2-dark',
                    )}>
                    <AppText className={cn('text-xs', inUse && 'text-white')}>
                      {inUse ? translate('packs.inUse') : translate('packs.use')}
                    </AppText>
                  </Pressable>
                }
              />
            );
          })}
        </Card>
      </Section>

      <Section title={translate('packs.translation')}>
        <Card className="gap-1">
          {catalog.data.translation.map((p) => {
            const title = translate(`languages.${p.code}` as TranslationKey, undefined, p.code);
            return (
              <PackRow
                key={p.code}
                title={title}
                subtitle={[
                  translate('packs.size', { size: p.sizeMb }),
                  p.required ? translate('packs.required') : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                pack={translationPacks[p.code]}
                onDownload={() => {
                  startDownload('translation', p.code, p.sizeMb);
                }}
                onDelete={() => {
                  confirmDelete('translation', p.code, title);
                }}
              />
            );
          })}
        </Card>
      </Section>
    </Screen>
  );
}
