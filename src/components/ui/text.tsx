import { Text, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

const VARIANTS = {
  title: 'text-3xl font-bold text-black dark:text-white',
  heading: 'text-lg font-semibold text-black dark:text-white',
  body: 'text-base text-black dark:text-white',
  caption: 'text-sm text-muted dark:text-muted-dark',
  label: 'text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark',
} as const;

export type AppTextProps = TextProps & { variant?: keyof typeof VARIANTS; className?: string };

export function AppText({ variant = 'body', className, ...rest }: AppTextProps) {
  return <Text className={cn(VARIANTS[variant], className)} {...rest} />;
}
