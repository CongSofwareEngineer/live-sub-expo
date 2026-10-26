# Changelog — Project Setup

## 2026-10-26

- Thêm NativeWind 4 + Tailwind 3.4 (babel/metro/tailwind config, global.css) → styling bằng className (babel.config.js, metro.config.js, tailwind.config.js)
- Thêm ESLint flat (expo + typescript-eslint strictTypeChecked + import/no-cycle, import/order + prettier), Prettier, Husky + lint-staged → lint/format trước commit (eslint.config.js, .prettierrc, .husky/pre-commit)
- Thêm scripts lint:fix, typecheck, format, prepare; bỏ script reset-project (package.json)
- Thêm bộ Icons bọc expo-symbols + config ảnh → theo skill icon-image (src/components/Icons/*, src/config/images.ts)
- Thêm UI kit NativeWind → dùng chung cho mọi màn (src/components/ui/*)
- Root layout mới: QueryClientProvider, theme theo settings, Stack.Protected theo onboarding; tabs Home/History/Settings (src/app/_layout.tsx, src/app/(tabs)/_layout.tsx)
- Theme: thêm màu primary/danger/success/warning, bỏ import global.css khỏi theme.ts (chuyển vào root layout) (src/constants/theme.ts)
- Fix lint template: use-color-scheme.web dùng useSyncExternalStore thay setState trong effect; themed-text bỏ ?? thừa (src/hooks/use-color-scheme.web.ts, src/components/themed-text.tsx)
- Xóa file template Expo (explore, index cũ, app-tabs, hint-row, web-badge, animated-icon, collapsible, external-link, scripts/reset-project.js) — đã được dev đồng ý
