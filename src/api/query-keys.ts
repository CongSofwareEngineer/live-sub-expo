export const QUERY_KEYS = {
  languageCatalog: ['language-catalog'],
  capturableApps: ['capturable-apps'],
  cloudCredential: (provider: string) => ['cloud-credential', provider],
} as const;
