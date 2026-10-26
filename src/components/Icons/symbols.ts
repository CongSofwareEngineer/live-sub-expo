import type { SymbolViewProps } from 'expo-symbols';

type SymbolName = Extract<SymbolViewProps['name'], { ios?: unknown }>;

// SF Symbol (iOS) + Material Symbol (Android/web) per icon
export const SYMBOLS = {
  mic: { ios: 'mic.fill', android: 'mic', web: 'mic' },
  stop: { ios: 'stop.circle.fill', android: 'stop_circle', web: 'stop_circle' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  home: { ios: 'house', android: 'home', web: 'home' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  globe: { ios: 'globe', android: 'language', web: 'language' },
  download: { ios: 'arrow.down.circle', android: 'download', web: 'download' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  cloud: { ios: 'cloud', android: 'cloud', web: 'cloud' },
  offline: { ios: 'icloud.slash', android: 'cloud_off', web: 'cloud_off' },
  layers: { ios: 'square.stack.3d.up', android: 'layers', web: 'layers' },
  speed: { ios: 'gauge.with.needle', android: 'speed', web: 'speed' },
  translate: { ios: 'character.bubble', android: 'translate', web: 'translate' },
  waveform: { ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' },
  apps: { ios: 'square.grid.2x2', android: 'apps', web: 'apps' },
  broadcast: { ios: 'dot.radiowaves.left.and.right', android: 'cast', web: 'cast' },
  tune: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  move: {
    ios: 'arrow.up.and.down.and.arrow.left.and.right',
    android: 'open_with',
    web: 'open_with',
  },
  wifiOff: { ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  minus: { ios: 'minus', android: 'remove', web: 'remove' },
} as const satisfies Record<string, SymbolName>;

export type SymbolKey = keyof typeof SYMBOLS;
