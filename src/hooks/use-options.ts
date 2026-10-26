import type { SegmentOption } from '@/components/ui/segmented';
import type { Direction } from '@/engine/types';
import { useLanguage } from '@/hooks/use-language';

// Translated option lists shared by onboarding / home
export function useDirectionOptions(): SegmentOption<Direction>[] {
  const { translate } = useLanguage();
  return [
    { value: 'en-vi', label: translate('direction.enVi') },
    { value: 'vi-en', label: translate('direction.viEn') },
    { value: 'auto', label: translate('direction.auto') },
  ];
}
