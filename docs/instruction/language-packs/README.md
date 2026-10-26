# Language Packs

## Mục đích

Quản lý gói dịch offline (ML Kit) và model whisper (tiny/base/small) (design.md mục 6.6).

## Luồng xử lý

- Danh mục: `useLanguageCatalog()` (TanStack Query, giai đoạn 1 = mock 300ms). EN, VI đánh dấu "Bắt buộc".
- Trạng thái: `useLanguagePackStore` (persist `language-packs`): `translation[code]`, `whisper[model]` = `{ status: idle|downloading|downloaded|error, progress }`.
- Tải: `useDownloadPack().mutate({ kind, id, sizeMb })` → giả lập tăng progress mỗi 120ms vào store → `downloaded`. Xóa: Alert xác nhận → `deletePack` → `idle`.
- Chọn model whisper đang dùng → `settings.whisperModel`.
- `useOfflineReady()` = model đang chọn + EN + VI đều `downloaded` → mới bật được chế độ Offline ở Home.

## Quy tắc / edge case

- Khi mở lại app, gói đang `downloading` bị đưa về `idle` (merge khi rehydrate) vì không resume được.
- Màn này truy cập được cả từ onboarding (ngoài `Stack.Protected`).

## TODO theo lộ trình

- Giai đoạn 4: tải whisper thật bằng `expo-file-system` (resume), `ml-translate.downloadModel(lang, { wifiOnly })`, chặn tải khi không có Wi-Fi nếu `wifiOnly`.

## File liên quan

- `src/api/language-catalog.ts`, `src/api/pack-download.ts`, `src/stores/language-pack-store.ts`
- `src/hooks/use-offline-ready.ts`, `src/components/pack-row.tsx`, `src/app/language-packs.tsx`

## Phụ thuộc

- [settings](../settings/README.md) (`whisperModel`, `wifiOnly`), [live-session](../live-session/README.md)
