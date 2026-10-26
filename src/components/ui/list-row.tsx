import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { ChevronRightIcon } from '@/components/Icons/chevron-right';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/cn';

type ListRowProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  selected?: boolean;
};

export function ListRow({ title, subtitle, icon, right, onPress, selected }: ListRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-xl px-1 py-2 active:opacity-60',
        selected && 'bg-primary-soft dark:bg-primary-soft-dark',
      )}>
      {icon}
      <View className="flex-1 gap-0.5">
        <AppText numberOfLines={1}>{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRightIcon size={14} color={theme.textSecondary} /> : null)}
    </Pressable>
  );
}
