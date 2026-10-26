import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const SECURE_KEY_NAME = 'livesub.mmkv-key';

/** Shared app storage (settings, history, overlay position, language packs). */
export const storage = createMMKV({ id: 'livesub' });

// Random 16-byte hex key for the encrypted MMKV instance
const randomKey = () => {
  const bytes = new Uint8Array(16);
  // Web Crypto may be missing on some Hermes builds → fallback to Math.random
  const webCrypto = (globalThis as { crypto?: Partial<Pick<Crypto, 'getRandomValues'>> }).crypto;
  if (webCrypto?.getRandomValues) {
    webCrypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

// Encryption key lives in expo-secure-store; created on first launch
const getEncryptionKey = (): string | undefined => {
  // SecureStore is not available on web
  if (Platform.OS === 'web') return undefined;
  const existing = SecureStore.getItem(SECURE_KEY_NAME);
  if (existing) return existing;
  const key = randomKey();
  SecureStore.setItem(SECURE_KEY_NAME, key);
  return key;
};

let secureInstance: MMKV | undefined;

/** Encrypted storage for API keys (lazy, so SecureStore runs only when needed). */
export const getSecureStorage = (): MMKV => {
  secureInstance ??= createMMKV({ id: 'livesub-secure', encryptionKey: getEncryptionKey() });
  return secureInstance;
};

/** zustand `persist` adapter backed by MMKV. */
export const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export const StorageKeys = {
  settings: 'settings',
  overlay: 'overlay',
  historyIndex: 'history-index',
  languagePacks: 'language-packs',
  session: (id: string) => `session:${id}`,
  apiKey: (provider: string) => `api-key:${provider}`,
} as const;
