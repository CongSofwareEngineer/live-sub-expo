import { TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/cn';

export function TextField({ className, ...rest }: TextInputProps & { className?: string }) {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      className={cn(
        'h-11 rounded-xl bg-surface-2 px-3 text-base text-black dark:bg-surface-2-dark dark:text-white',
        className,
      )}
      {...rest}
    />
  );
}
