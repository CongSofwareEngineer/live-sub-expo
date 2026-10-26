import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/hooks/use-language';
import { queryClient } from '@/lib/query';
import { useSettingsStore } from '@/stores/settings-store';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAppTheme();
  const scheme = useColorScheme();
  const { translate } = useLanguage();
  // MMKV persist hydrates synchronously → safe to gate on first render
  const onboarded = useSettingsStore((s) => s.onboarded);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Protected guard={!onboarded}>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={onboarded}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="live"
              options={{ title: translate('live.title'), gestureEnabled: false }}
            />
            <Stack.Screen name="overlay-editor" options={{ title: translate('overlay.title') }} />
            <Stack.Screen name="history/[id]" options={{ title: translate('history.title') }} />
            <Stack.Screen name="debug" options={{ title: translate('debug.title') }} />
          </Stack.Protected>
          {/* Reachable from onboarding (offline mode) and settings */}
          <Stack.Screen name="language-packs" options={{ title: translate('packs.title') }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
