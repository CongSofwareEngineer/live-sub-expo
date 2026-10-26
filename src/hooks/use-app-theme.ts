import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

import { useSettingsStore } from '@/stores/settings-store';

// Apply theme pref (system/light/dark) app-wide; NativeWind & useColorScheme follow Appearance
export function useAppTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    // react-native-web has no override API → web follows the OS
    if (Platform.OS === 'web') return;
    Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
  }, [theme]);
}
