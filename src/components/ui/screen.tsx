import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/utils/cn';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  /** Pad status bar inset (tab screens have no header) */
  safeTop?: boolean;
  className?: string;
};

// Screen container: themed background + standard padding
export function Screen({ children, scroll = true, safeTop, className }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const content = cn('gap-5 p-4 pb-10', className);
  const topStyle = safeTop ? { paddingTop: insets.top + 16 } : undefined;

  if (!scroll) {
    return (
      <View className={cn('flex-1 bg-white dark:bg-black', content)} style={topStyle}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      contentContainerClassName={content}
      contentContainerStyle={topStyle}
      contentInsetAdjustmentBehavior={safeTop ? 'never' : 'automatic'}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}
