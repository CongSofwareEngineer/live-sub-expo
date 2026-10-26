import type { LangCode } from '@/engine/types';

// Fake transcript for phase 1 (no real audio / provider yet)
export const MOCK_SENTENCES: { lang: LangCode; text: string; translation: string }[] = [
  {
    lang: 'en',
    text: 'Welcome back to the channel everyone.',
    translation: 'Chào mừng mọi người quay lại kênh.',
  },
  {
    lang: 'en',
    text: 'Today we are going to talk about real time translation on mobile devices and why latency matters so much for subtitles.',
    translation:
      'Hôm nay chúng ta sẽ nói về dịch thời gian thực trên thiết bị di động và vì sao độ trễ lại quan trọng với phụ đề.',
  },
  {
    lang: 'en',
    text: 'Let me show you a quick demo.',
    translation: 'Để tôi cho bạn xem một bản demo nhanh.',
  },
  {
    lang: 'vi',
    text: 'Xin chào, hôm nay trời đẹp quá.',
    translation: 'Hello, the weather is so nice today.',
  },
  {
    lang: 'vi',
    text: 'Bạn có thể nói chậm hơn một chút được không?',
    translation: 'Could you speak a little slower?',
  },
  {
    lang: 'en',
    text: 'Thanks for watching and see you next time!',
    translation: 'Cảm ơn đã xem và hẹn gặp lại lần sau!',
  },
];

export const MOCK_CAPTURABLE_APPS = [
  { packageName: 'com.google.android.youtube', label: 'YouTube' },
  { packageName: 'com.android.chrome', label: 'Chrome' },
  { packageName: 'us.zoom.videomeetings', label: 'Zoom' },
  { packageName: 'com.google.android.apps.meetings', label: 'Google Meet' },
  { packageName: 'com.microsoft.teams', label: 'Microsoft Teams' },
  { packageName: 'com.spotify.music', label: 'Spotify' },
];
