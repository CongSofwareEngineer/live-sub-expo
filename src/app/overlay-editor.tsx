import { useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';

import { MoveIcon } from '@/components/Icons/move';
import { SubtitlePreview } from '@/components/subtitle-preview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ColorSwatches } from '@/components/ui/color-swatches';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Segmented } from '@/components/ui/segmented';
import { Stepper } from '@/components/ui/stepper';
import { AppText } from '@/components/ui/text';
import { ToggleRow } from '@/components/ui/toggle-row';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import {
  OVERLAY_BG_COLORS,
  OVERLAY_STYLE_LIMITS,
  OVERLAY_TEXT_COLORS,
  useOverlayStore,
  type Orientation,
} from '@/stores/overlay-store';

const WIDTH_LIMITS = { min: 0.4, max: 1, step: 0.05 };
const FRAME_RATIO: Record<Orientation, number> = { portrait: 9 / 16, landscape: 16 / 9 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type DragStart = { pageX: number; pageY: number; x: number; y: number };

export default function OverlayEditorScreen() {
  const { translate } = useLanguage();
  const theme = useTheme();
  const { position, style, setPosition, setStyle, resetStyle } = useOverlayStore();
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [boxH, setBoxH] = useState(0);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const pos = position[orientation];
  const current = drag ?? pos;
  const maxY = frame.h ? Math.max(0, 1 - boxH / frame.h) : 1;

  // Drag inside the mock screen; position saved normalized (0..1) on release
  const onMove = (e: GestureResponderEvent) => {
    if (!dragStart || !frame.w) return;
    const { pageX, pageY } = e.nativeEvent;
    setDrag({
      x: clamp(dragStart.x + (pageX - dragStart.pageX) / frame.w, 0, 1 - pos.width),
      y: clamp(dragStart.y + (pageY - dragStart.pageY) / frame.h, 0, maxY),
    });
  };

  const onRelease = () => {
    if (drag) setPosition(orientation, { ...pos, ...drag });
    setDrag(null);
    setDragStart(null);
  };

  return (
    <Screen>
      <Section title={translate('overlay.preview')}>
        <Card className="items-center">
          <Segmented<Orientation>
            options={[
              { value: 'portrait', label: translate('overlay.portrait') },
              { value: 'landscape', label: translate('overlay.landscape') },
            ]}
            value={orientation}
            onChange={setOrientation}
          />
          <View
            className="overflow-hidden rounded-xl bg-surface-2 dark:bg-surface-2-dark"
            style={{
              aspectRatio: FRAME_RATIO[orientation],
              width: orientation === 'portrait' ? '60%' : '100%',
            }}
            onLayout={(e) => {
              setFrame({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
            }}>
            {frame.w > 0 ? (
              <View
                accessibilityHint={translate('overlay.dragHint')}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderTerminationRequest={() => false}
                onResponderGrant={(e) => {
                  setDragStart({
                    pageX: e.nativeEvent.pageX,
                    pageY: e.nativeEvent.pageY,
                    x: pos.x,
                    y: pos.y,
                  });
                }}
                onResponderMove={onMove}
                onResponderRelease={onRelease}
                onResponderTerminate={onRelease}
                onLayout={(e) => {
                  setBoxH(e.nativeEvent.layout.height);
                }}
                style={{
                  position: 'absolute',
                  left: current.x * frame.w,
                  top: current.y * frame.h,
                  width: pos.width * frame.w,
                }}>
                <SubtitlePreview
                  style={{
                    ...style,
                    fontSize: style.fontSize * (orientation === 'portrait' ? 0.6 : 0.8),
                  }}
                  original={translate('overlay.sampleOriginal')}
                  translated={translate('overlay.sampleTranslated')}
                />
              </View>
            ) : null}
          </View>
          <View className="flex-row items-center gap-2">
            <MoveIcon size={14} color={theme.textSecondary} />
            <AppText variant="caption">{translate('overlay.dragHint')}</AppText>
          </View>
          <AppText variant="caption" className="text-center">
            {translate('overlay.nativeNote')}
          </AppText>
        </Card>
      </Section>

      <Section title={translate('overlay.title')}>
        <Card>
          <Stepper
            label={translate('overlay.fontSize')}
            value={style.fontSize}
            display={String(style.fontSize)}
            {...OVERLAY_STYLE_LIMITS.fontSize}
            onChange={(fontSize) => {
              setStyle({ fontSize });
            }}
          />
          <Stepper
            label={translate('overlay.maxLines')}
            value={style.maxLines}
            display={String(style.maxLines)}
            {...OVERLAY_STYLE_LIMITS.maxLines}
            onChange={(maxLines) => {
              setStyle({ maxLines });
            }}
          />
          <Stepper
            label={translate('overlay.bgOpacity')}
            value={style.bgOpacity}
            display={`${Math.round(style.bgOpacity * 100)}%`}
            {...OVERLAY_STYLE_LIMITS.bgOpacity}
            onChange={(bgOpacity) => {
              setStyle({ bgOpacity });
            }}
          />
          <Stepper
            label={translate('overlay.width')}
            value={pos.width}
            display={`${Math.round(pos.width * 100)}%`}
            {...WIDTH_LIMITS}
            onChange={(width) => {
              setPosition(orientation, { ...pos, width, x: Math.min(pos.x, 1 - width) });
            }}
          />
          <ColorSwatches
            label={translate('overlay.textColor')}
            colors={OVERLAY_TEXT_COLORS}
            value={style.textColor}
            onChange={(textColor) => {
              setStyle({ textColor });
            }}
          />
          <ColorSwatches
            label={translate('overlay.bgColor')}
            colors={OVERLAY_BG_COLORS}
            value={style.bgColor}
            onChange={(bgColor) => {
              setStyle({ bgColor });
            }}
          />
          <ToggleRow
            label={translate('overlay.showOriginal')}
            value={style.showOriginal}
            onChange={(showOriginal) => {
              setStyle({ showOriginal });
            }}
          />
        </Card>
      </Section>

      <Button variant="secondary" label={translate('overlay.resetStyle')} onPress={resetStyle} />
    </Screen>
  );
}
