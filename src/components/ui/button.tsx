import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: { box: 'bg-primary', text: 'text-white' },
  secondary: { box: 'bg-surface-2 dark:bg-surface-2-dark', text: 'text-black dark:text-white' },
  danger: { box: 'bg-danger', text: 'text-white' },
  ghost: { box: 'bg-transparent', text: 'text-primary' },
} as const;

const SIZES = {
  md: { box: 'h-11 px-4 rounded-xl', text: 'text-base' },
  lg: { box: 'h-16 px-6 rounded-2xl', text: 'text-lg' },
} as const;

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  className,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      className={cn(
        'flex-row items-center justify-center gap-2 active:opacity-70',
        v.box,
        s.box,
        inactive && 'opacity-50',
        className,
      )}>
      {loading ? <ActivityIndicator color="#fff" /> : icon && <View>{icon}</View>}
      <AppText className={cn('font-semibold', v.text, s.text)}>{label}</AppText>
    </Pressable>
  );
}
