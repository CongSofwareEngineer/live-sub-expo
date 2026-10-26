import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type ColorSwatchesProps = {
  label: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
};

export function ColorSwatches({ label, colors, value, onChange }: ColorSwatchesProps) {
  return (
    <View className="flex-row items-center gap-3">
      <AppText className="flex-1">{label}</AppText>
      {colors.map((c) => (
        <Pressable
          key={c}
          accessibilityRole="radio"
          accessibilityLabel={`${label} ${c}`}
          accessibilityState={{ selected: c === value }}
          onPress={() => {
            onChange(c);
          }}
          className={cn(
            'h-8 w-8 rounded-full border border-surface-2 dark:border-surface-2-dark',
            c === value && 'border-2 border-primary dark:border-primary',
          )}
          style={{ backgroundColor: c }}
        />
      ))}
    </View>
  );
}
