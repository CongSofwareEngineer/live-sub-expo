import { Pressable, View } from 'react-native';

import { MinusIcon } from '@/components/Icons/minus';
import { PlusIcon } from '@/components/Icons/plus';
import { AppText } from '@/components/ui/text';

type StepperProps = {
  label: string;
  hint?: string;
  value: number;
  /** Text shown for current value */
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

// Clamp & round to step precision (avoids 0.30000000004)
const clampStep = (v: number, min: number, max: number, step: number) => {
  const decimals = String(step).split('.')[1]?.length ?? 0;
  return Number(Math.min(max, Math.max(min, v)).toFixed(decimals));
};

export function Stepper({ label, hint, value, display, min, max, step, onChange }: StepperProps) {
  const btn =
    'h-9 w-9 items-center justify-center rounded-full bg-surface-2 active:opacity-60 dark:bg-surface-2-dark';
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 gap-0.5">
        <AppText>{label}</AppText>
        {hint ? <AppText variant="caption">{hint}</AppText> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} −`}
        disabled={value <= min}
        onPress={() => {
          onChange(clampStep(value - step, min, max, step));
        }}
        className={btn}>
        <MinusIcon size={14} />
      </Pressable>
      <AppText className="min-w-16 text-center font-semibold">{display}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} +`}
        disabled={value >= max}
        onPress={() => {
          onChange(clampStep(value + step, min, max, step));
        }}
        className={btn}>
        <PlusIcon size={14} />
      </Pressable>
    </View>
  );
}
