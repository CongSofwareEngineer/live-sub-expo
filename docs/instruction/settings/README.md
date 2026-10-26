# Settings

## Mục đích

Cài đặt người dùng (design.md mục 6.7, 7): provider cloud + API key, ngưỡng ngắt câu, Wi-Fi, giao diện, ngôn ngữ UI, lối tắt công cụ.

## Luồng xử lý

- `useSettingsStore` (persist `settings`): `direction`, `engine`, `cloudProvider`, `whisperModel`, `segmentation { silenceMs, maxWords }`, `theme`, `uiLang`, `wifiOnly`, `onboarded`. Ghi bằng `update(patch)` / `setSegmentation(patch)`.
- **API key**: form TanStack Form (`ApiKeyForm`, remount theo provider). Validate khi submit: không rỗng thì ≥ 8 ký tự. Lưu qua `useSaveApiKey()` → MMKV mã hóa key `api-key:<provider>`; rỗng = xóa key. Đọc qua `useCloudCredential(provider)` (query, invalidate sau khi lưu).
- Ngắt câu: im lặng 300–1000ms (bước 50), số từ 6–20.
- Giao diện: theme system/light/dark, ngôn ngữ VI/EN.
- Công cụ: Gói ngôn ngữ, Phụ đề nổi, Debug độ trễ. "Xem lại hướng dẫn" → `onboarded = false`.

## TODO theo lộ trình

- Giai đoạn 6: `useCloudCredential` lấy token tạm thời từ backend NestJS thay cho API key người dùng.

## File liên quan

- `src/stores/settings-store.ts`, `src/api/cloud-credential.ts`, `src/api/query-keys.ts`, `src/app/(tabs)/settings.tsx`

## Phụ thuộc

- [storage](../storage/README.md), [i18n](../i18n/README.md), [segmenter](../segmenter/README.md)
