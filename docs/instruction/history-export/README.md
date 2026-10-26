# History & Export

## Mục đích

Lưu phiên đã kết thúc, xem lại, tìm kiếm, xuất TXT / SRT, chia sẻ, xóa (design.md mục 6.5, 7).

## Luồng xử lý

- `useHistoryStore.save(meta, segments)`: segments ghi vào key MMKV riêng `session:<id>`; `sessions` (index, mới nhất trước) persist ở `history-index`. Tránh một JSON khổng lồ.
- `getSegments(id)` đọc + parse key riêng (lỗi parse → `[]`).
- **Danh sách** (`src/app/(tabs)/history.tsx`): ngày giờ · thời lượng, nguồn · số câu, preview. Tìm kiếm: khớp preview/tên app trước, không khớp mới đọc segments của phiên.
- **Chi tiết** (`src/app/history/[id].tsx`): đọc segments 1 lần, tìm trong phiên, Xuất TXT / SRT qua `Share.share` (dạng text), Xóa (Alert xác nhận) → `remove(id)` xóa cả key `session:<id>` → back.
- **SRT** (`toSrt`): cue i = `startedAt` → `committedAt` (tương đối so với đầu phiên), tối thiểu 1s, không đè cue sau; nội dung = bản dịch + câu gốc. **TXT** (`toTxt`): gốc + dịch, cách dòng trống.

## Quy tắc / edge case

- Phiên không có cụm nào → không lưu.
- id không tồn tại → "Không tìm thấy phiên".
- Giai đoạn sau có thể xuất file thật (`expo-file-system` + share file).

## File liên quan

- `src/stores/history-store.ts`, `src/utils/srt.ts`, `src/utils/format.ts`
- `src/app/(tabs)/history.tsx`, `src/app/history/[id].tsx`

## Phụ thuộc

- [storage](../storage/README.md), [live-session](../live-session/README.md)
