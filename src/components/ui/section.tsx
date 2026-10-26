import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <AppText variant="label" className="px-1">
        {title}
      </AppText>
      {children}
    </View>
  );
}
