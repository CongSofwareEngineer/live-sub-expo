import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

export function Card({ className, ...rest }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn('gap-3 rounded-2xl bg-surface p-4 dark:bg-surface-dark', className)}
      {...rest}
    />
  );
}
