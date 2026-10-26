import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import type { LatencySample } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';
import { useSessionStore } from '@/stores/session-store';
import { formatMs } from '@/utils/format';

type Metric = 'sttMs' | 'translateMs' | 'totalMs';

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined);

// Nearest-rank percentile
const percentile = (xs: number[], p: number) => {
  if (!xs.length) return undefined;
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
};

function MetricCard({
  label,
  metric,
  samples,
}: {
  label: string;
  metric: Metric;
  samples: LatencySample[];
}) {
  const { translate } = useLanguage();
  const values = samples.map((s) => s[metric]);
  const cells = [
    { label: translate('debug.last'), value: values.at(-1) },
    { label: translate('debug.avg'), value: avg(values) },
    { label: translate('debug.p95'), value: percentile(values, 95) },
  ];
  return (
    <Card>
      <AppText variant="heading">{label}</AppText>
      <View className="flex-row">
        {cells.map((c) => (
          <View key={c.label} className="flex-1 gap-0.5">
            <AppText variant="caption">{c.label}</AppText>
            <AppText className="text-xl font-semibold">{formatMs(c.value)}</AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default function DebugScreen() {
  const { translate } = useLanguage();
  const samples = useSessionStore((s) => s.latency.samples);

  return (
    <Screen>
      {samples.length === 0 ? (
        <AppText variant="caption">{translate('debug.empty')}</AppText>
      ) : (
        <AppText variant="caption">{translate('debug.samples', { count: samples.length })}</AppText>
      )}
      <MetricCard label={translate('debug.stt')} metric="sttMs" samples={samples} />
      <MetricCard label={translate('debug.translate')} metric="translateMs" samples={samples} />
      <MetricCard label={translate('debug.total')} metric="totalMs" samples={samples} />
      <AppText variant="caption">{translate('debug.note')}</AppText>
    </Screen>
  );
}
