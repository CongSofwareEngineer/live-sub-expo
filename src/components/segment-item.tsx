import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import type { Segment } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';

// Bilingual line: small muted original + large translation (italic while pending)
export function SegmentItem({ segment }: { segment: Segment }) {
  const { translate } = useLanguage();
  const pending = segment.translated === undefined;
  return (
    <View className="gap-1 py-2">
      <AppText variant="caption">{segment.original}</AppText>
      <AppText
        className={
          pending ? 'text-lg italic text-muted dark:text-muted-dark' : 'text-lg font-medium'
        }>
        {segment.translated ?? translate('live.translating')}
      </AppText>
    </View>
  );
}

// Uncommitted STT text of current utterance
export function PartialLine({ text }: { text: string }) {
  return (
    <AppText variant="caption" className="py-2 italic">
      {text}
    </AppText>
  );
}
