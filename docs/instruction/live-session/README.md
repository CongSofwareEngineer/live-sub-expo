# Live Session

## Mục đích

Chạy một phiên dịch: Home chọn nguồn / chiều / chế độ → pipeline → màn Live hiển thị song ngữ realtime + độ trễ (design.md mục 4, 6.2, 6.3, 8).

## Luồng xử lý

1. **Home** (`src/app/(tabs)/index.tsx`): chọn Nguồn (Mic / App khác — Android chọn app qua `AppPicker`, iOS nút phát sóng _disabled_ tới giai đoạn 5, web tắt), Chiều dịch, Chế độ (Offline _disabled_ nếu `useOfflineReady()` false → hiển thị Cloud), toggle phụ đề nổi (iOS disabled). Cảnh báo nếu Cloud chưa có API key (giai đoạn 1 vẫn cho chạy vì dùng mock).
2. **Bắt đầu** → `router.push('/live')` + `startSession()`. Nguồn App trên Android bắt buộc chọn app trước.
3. **Pipeline** (`src/engine/pipeline.ts`):
   - `createEngines(mode)` → `{ stt, translator }` (giai đoạn 1: cả hai mode dùng mock).
   - STT lang: `en-vi` → `en`, `vi-en` → `vi`, `auto` → `auto`.
   - `stt.onPartial` → `segmenter.pushPartial` → `session.partial`. `stt.onFinal` → `segmenter.pushFinal`.
   - Mỗi cụm commit được đánh **id tăng dần** → `addSegment` → dịch song song → `setTranslation(id)`. Hiển thị theo id nên **đúng thứ tự** dù bản dịch về lệch.
   - Ngôn ngữ cụm khi `auto`: lang của final, nếu không có → `detectLang()` (heuristic dấu tiếng Việt, thay bằng ML Kit ở giai đoạn 4).
4. **Độ trễ** mỗi cụm: `sttMs` = commit − chữ đầu tiên; `translateMs` = có bản dịch − commit; `totalMs` = tổng. Lưu `latency.last` + 100 mẫu gần nhất.
5. **Dừng** (`stopSession`): `stt.stop` → `segmenter.flush` → chờ mọi bản dịch đang chạy → lưu vào lịch sử (nếu có ≥1 cụm) → Live `replace` sang `/history/[id]`.
6. Rời màn Live (back) không dừng phiên; Home hiện nút "Xem phiên đang chạy".
7. **Debug** (`src/app/debug.tsx`): Gần nhất / Trung bình / P95 cho STT, dịch, tổng của phiên gần nhất.

## Quy tắc / edge case

- `startSession` bỏ qua nếu đã có phiên chạy.
- Lỗi `stt.start` → status `error`, Live hiện màn lỗi.
- Session store **không persist**; `begin()` reset toàn bộ phiên trước.
- Mock STT (`src/engine/stt/mock.ts`) phát `MOCK_SENTENCES` từng từ (220ms/từ, nghỉ 650ms sau dấu phẩy để kích hoạt cắt theo im lặng, 900ms giữa câu). Mock dịch tra câu chính xác, không khớp → `[<lang>] <text>`.

## TODO theo lộ trình

- Giai đoạn 2: `modules/audio-capture` (mic) → `stt.pushAudio`, cloud STT WebSocket, xin quyền mic, đo thời gian capture.
- Giai đoạn 3: capture app khác (Android), đẩy dòng mới lên `subtitle-overlay`.

## File liên quan

- `src/engine/types.ts`, `src/engine/pipeline.ts`, `src/engine/factory.ts`, `src/engine/detect-lang.ts`
- `src/engine/stt/mock.ts`, `src/engine/translate/mock.ts`, `src/engine/mock-data.ts`
- `src/stores/session-store.ts`, `src/hooks/use-offline-ready.ts`, `src/hooks/use-options.ts`
- `src/api/capturable-apps.ts`, `src/components/app-picker.tsx`, `src/components/segment-item.tsx`, `src/components/status-pill.tsx`
- `src/app/(tabs)/index.tsx`, `src/app/live.tsx`, `src/app/debug.tsx`

## Phụ thuộc

- [segmenter](../segmenter/README.md), [history-export](../history-export/README.md), [settings](../settings/README.md), [language-packs](../language-packs/README.md), [subtitle-overlay](../subtitle-overlay/README.md)
