import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import type { OverlayStyle } from '@/stores/overlay-store';

type SubtitlePreviewProps = { style: OverlayStyle; original: string; translated: string };

// In-app mirror of the native subtitle overlay look
export function SubtitlePreview({ style, original, translated }: SubtitlePreviewProps) {
  return (
    <View className="overflow-hidden rounded-lg px-3 py-2">
      <View
        className="absolute inset-0"
        style={{ backgroundColor: style.bgColor, opacity: style.bgOpacity }}
      />
      {style.showOriginal ? (
        <AppText
          numberOfLines={1}
          style={{ color: style.textColor, fontSize: style.fontSize * 0.7, opacity: 0.8 }}>
          {original}
        </AppText>
      ) : null}
      <AppText
        numberOfLines={style.maxLines}
        style={{ color: style.textColor, fontSize: style.fontSize, fontWeight: '600' }}>
        {translated}
      </AppText>
    </View>
  );
}
