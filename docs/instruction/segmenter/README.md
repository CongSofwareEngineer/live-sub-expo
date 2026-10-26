# Segmenter

## Mục đích

"Dịch sớm" (design.md mục 4): cắt luồng text STT thành cụm để dịch, không đợi hết câu.

## Luồng xử lý

Input: partial **tích lũy** của câu hiện tại (`pushPartial`), final (`pushFinal(text, lang)`).
Commit một cụm (`onCommit({ text, reason, startedAt, lang? })`) khi:

1. **punctuation** — từ kết thúc bằng `. ? ! … ; :` → cắt tới từ có dấu câu cuối cùng.
2. **max-words** — phần chưa commit ≥ `maxWords` (mặc định 12) → cắt mỗi `maxWords` từ.
3. **silence** — không có partial mới trong `silenceMs` (mặc định 400ms) → commit phần còn lại.
4. **final** — STT trả final → commit phần còn lại, reset câu. `flush()` khi dừng phiên.

`getPending()` = phần chưa commit (hiển thị dạng partial).

## Quy tắc / edge case

- Đếm theo **số từ** đã commit: từ đã commit bị "đóng băng", nếu STT sửa lại các từ đó thì bỏ qua.
- Final có ít từ hơn phần đã commit → không commit gì thêm.
- `lang` chỉ có khi commit từ final; còn lại pipeline tự xác định.
- `now` có thể inject để test.

## File liên quan

- `src/engine/segmenter.ts`

## Phụ thuộc

- [live-session](../live-session/README.md) (pipeline gọi segmenter), [settings](../settings/README.md) (`segmentation`)
