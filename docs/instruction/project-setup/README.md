# Project Setup

## Mục đích

Khung dự án giai đoạn 1 (design.md mục 3, 10, 12): styling NativeWind, lint/format, icon, ảnh, theme sáng/tối, provider gốc.

## Luồng xử lý

- **Styling**: NativeWind 4 (Tailwind 3.4). `babel.config.js` (`jsxImportSource: 'nativewind'` + `nativewind/babel`), `metro.config.js` (`withNativeWind`, input `src/global.css`), `tailwind.config.js` (palette). Dark mode dùng biến thể `dark:` (theo `Appearance`).
- **Palette**: `tailwind.config.js` (class) và `src/constants/theme.ts` (`Colors`, dùng cho icon / NativeTabs / Switch) phải **giữ đồng bộ**.
- **Theme**: `useAppTheme()` gọi `Appearance.setColorScheme()` theo `settings.theme` (`system` → `unspecified`). Web bỏ qua (theo OS).
- **Icons** (skill `icon-image`): chỉ dùng `src/components/Icons/*`. Mỗi icon bọc `SymbolIcon` (expo-symbols: SF Symbol iOS, Material Symbol Android/web). Tên symbol khai báo ở `Icons/symbols.ts` (dùng chung cho NativeTabs). Thêm icon mới = thêm key vào `SYMBOLS` + file `<name>.tsx`.
- **Ảnh**: chỉ tham chiếu qua `src/config/images.ts`.
- **UI kit** `src/components/ui/`: `AppText`, `Screen` (`safeTop` cho màn tab), `Card`, `Section`, `Button`, `Segmented`, `ToggleRow`, `ListRow`, `Stepper`, `ProgressBar`, `TextField`, `ColorSwatches`. Ghép class bằng `cn()` (`src/utils/cn.ts`).
- **Root layout** `src/app/_layout.tsx`: import `@/global.css`, `QueryClientProvider` (`src/lib/query.ts`), `ThemeProvider`, `Stack.Protected` theo `settings.onboarded`.
- **Lint/format**: `eslint.config.js` (expo flat + typescript-eslint `strictTypeChecked` + `import/no-cycle`, `import/order` + `eslint-config-prettier`), `.prettierrc` (+ `prettier-plugin-tailwindcss`). Husky `pre-commit` → `lint-staged`.
- Scripts: `lint`, `lint:fix`, `typecheck`, `format`, `prepare` (husky).
- Typed routes: `.expo/types` sinh khi chạy `npx expo start` — cần chạy ít nhất một lần trước `tsc`.

## Quy tắc / edge case

- MMKV v4 + Nitro là native → **không chạy trên Expo Go**, cần dev build (`npx expo run:ios|android`).
- Không thêm `useMemo`/`useCallback` (React Compiler bật).

## File liên quan

- `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `nativewind-env.d.ts`, `src/global.css`
- `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.husky/pre-commit`, `package.json`
- `src/constants/theme.ts`, `src/hooks/use-app-theme.ts`, `src/hooks/use-theme.ts`, `src/hooks/use-color-scheme*.ts`
- `src/components/Icons/*`, `src/config/images.ts`, `src/components/ui/*`, `src/utils/cn.ts`
- `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx`, `src/lib/query.ts`

## Phụ thuộc

- [i18n](../i18n/README.md), [storage](../storage/README.md), [onboarding](../onboarding/README.md)
