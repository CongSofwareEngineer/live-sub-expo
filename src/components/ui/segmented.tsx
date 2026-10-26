import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/utils/cn';

export type SegmentOption<T extends string> = { value: T; label: string; disabled?: boolean };

type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row gap-1 rounded-xl bg-surface-2 p-1 dark:bg-surface-2-dark">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: opt.disabled }}
            disabled={opt.disabled}
            onPress={() => {
              onChange(opt.value);
            }}
            className={cn(
              'flex-1 items-center justify-center rounded-lg px-2 py-2',
              selected && 'bg-white dark:bg-black',
              opt.disabled && 'opacity-40',
            )}>
            <AppText
              numberOfLines={1}
              className={cn(
                'text-sm',
                selected ? 'font-semibold' : 'text-muted dark:text-muted-dark',
              )}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
