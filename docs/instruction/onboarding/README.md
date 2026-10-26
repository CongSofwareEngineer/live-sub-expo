# Onboarding

## Mục đích

Luồng lần đầu (design.md mục 6.1): giới thiệu + chiều dịch → chế độ → quyền.

## Luồng xử lý

- Root layout dùng `Stack.Protected`: `onboarded = false` → chỉ vào được nhóm `(onboarding)`; `true` → tabs và các màn khác. Đổi cờ → router tự chuyển.
- `(onboarding)/index.tsx`: logo, giới thiệu, chọn chiều dịch → `/mode`.
- `(onboarding)/mode.tsx`: Cloud (nhắc nhập API key sau) / Offline (nút mở `/language-packs`) → `/permissions`.
- `(onboarding)/permissions.tsx`: giải thích quyền mic + overlay; "Bắt đầu dùng" → `onboarded = true`.

## Quy tắc / edge case

- Giai đoạn 1 chưa có module audio nên chưa gọi hộp thoại xin quyền mic (giai đoạn 2 sẽ xin khi bắt đầu phiên đầu tiên). Quyền overlay xin khi bật phụ đề nổi lần đầu (giai đoạn 3).

## File liên quan

- `src/app/_layout.tsx`, `src/app/(onboarding)/*`

## Phụ thuộc

- [settings](../settings/README.md), [language-packs](../language-packs/README.md)
