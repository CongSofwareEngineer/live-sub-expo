# Subtitle Overlay

## Mục đích

Cấu hình phụ đề nổi trên app khác: bật/tắt, vị trí theo hướng màn hình, kiểu chữ (design.md mục 5.2, 6.4). Giai đoạn 1 chỉ có store + màn chỉnh với preview trong app.

## Luồng xử lý

- `useOverlayStore` (persist `overlay`): `enabled`, `position { portrait, landscape }`, `style { fontSize, textColor, bgColor, bgOpacity, maxLines, showOriginal }`.
- Vị trí **chuẩn hóa 0..1** theo kích thước màn hình (`x`, `y` = góc trên trái, `width` = tỉ lệ chiều rộng).
- **Màn chỉnh** (`src/app/overlay-editor.tsx`): chọn Dọc/Ngang → khung giả lập màn hình (9:16 / 16:9); kéo khung phụ đề bằng Gesture Responder của RN, lưu vị trí khi thả. Clamp: `x ∈ [0, 1 − width]`, `y ∈ [0, 1 − chiều cao khung / chiều cao màn]`. Đổi độ rộng cũng kéo `x` vào trong.
- Stepper: cỡ chữ 12–32, số dòng 1–5, độ mờ nền 0–100% (bước 10%), độ rộng 40–100%. Swatch màu chữ / nền. "Đặt lại kiểu" chỉ reset style, không reset vị trí.
- `SubtitlePreview` mô phỏng giao diện overlay native.
- Home: toggle `enabled` (Android); iOS disabled (PiP ở giai đoạn 5).

## TODO theo lộ trình

- Giai đoạn 3: `modules/subtitle-overlay` (WindowManager, `FLAG_NOT_TOUCHABLE`, edit mode, `onPositionChange`), xin quyền SYSTEM_ALERT_WINDOW khi bật lần đầu, pipeline đẩy text.

## File liên quan

- `src/stores/overlay-store.ts`, `src/app/overlay-editor.tsx`, `src/components/subtitle-preview.tsx`, `src/components/ui/color-swatches.tsx`, `src/components/ui/stepper.tsx`

## Phụ thuộc

- [live-session](../live-session/README.md), [storage](../storage/README.md)
