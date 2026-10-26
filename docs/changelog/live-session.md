# Changelog — Live Session

## 2026-10-26

- Thêm interface SttEngine/Translator + types (src/engine/types.ts)
- Thêm mock STT/dịch + factory chọn engine → chạy thử pipeline không cần audio (src/engine/stt/mock.ts, src/engine/translate/mock.ts, src/engine/factory.ts)
- Thêm pipeline start/stop: STT → segmenter → dịch song song giữ thứ tự id → session store → lịch sử; đo độ trễ từng cụm (src/engine/pipeline.ts)
- Thêm useSessionStore (không persist) (src/stores/session-store.ts)
- Thêm màn Home, Live, Debug độ trễ (src/app/(tabs)/index.tsx, src/app/live.tsx, src/app/debug.tsx)
