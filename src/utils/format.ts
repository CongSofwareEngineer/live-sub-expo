// mm:ss or h:mm:ss
export const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${String(m).padStart(h ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`;
  return h ? `${h}:${mmss}` : mmss;
};

// Locale-aware date + time (e.g. 26/10/2026 14:05)
export const formatDateTime = (ts: number, locale: string) =>
  new Date(ts).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatMs = (ms?: number) => (ms === undefined ? '–' : `${Math.round(ms)} ms`);
