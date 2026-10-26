# Storage

## Mục đích

Lưu trữ cục bộ bằng MMKV (design.md mục 7): settings, lịch sử, overlay, gói ngôn ngữ; API key mã hóa.

## Luồng xử lý

- `storage` = `createMMKV({ id: 'livesub' })` dùng chung.
- `getSecureStorage()` (lazy) = MMKV `livesub-secure` có `encryptionKey`. Key 16 byte hex sinh ngẫu nhiên lần đầu, lưu `expo-secure-store` (`livesub.mmkv-key`, API sync). Web không có SecureStore → không mã hóa.
- `zustandStorage`: adapter `StateStorage` cho `persist` + `createJSONStorage`. MMKV đồng bộ → store hydrate ngay lần render đầu.
- Tên key tập trung ở `StorageKeys`: `settings`, `overlay`, `history-index`, `language-packs`, `session:<id>`, `api-key:<provider>`.

## Quy tắc / edge case

- Sinh key ưu tiên `crypto.getRandomValues`, thiếu thì fallback `Math.random`.
- Đổi tên / xóa key MMKV phải xin phép dev (CLAUDE.md rule 0) vì mất dữ liệu người dùng.

## File liên quan

- `src/lib/storage.ts`

## Phụ thuộc

- Dùng bởi mọi store trong `src/stores/` và [settings](../settings/README.md) (API key).
