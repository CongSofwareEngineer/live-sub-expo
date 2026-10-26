import { SymbolView } from 'expo-symbols';

import { SYMBOLS, type SymbolKey } from '@/components/Icons/symbols';
import { useTheme } from '@/hooks/use-theme';

export type IconProps = { size?: number; color?: string };

// Base renderer for all icons in this folder
export function SymbolIcon({ symbol, size = 22, color }: IconProps & { symbol: SymbolKey }) {
  const theme = useTheme();
  return <SymbolView name={SYMBOLS[symbol]} size={size} tintColor={color ?? theme.text} />;
}
