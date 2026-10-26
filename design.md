# LiveSub – App dịch giọng nói realtime (Mobile)

> Tài liệu thiết kế để Claude Code dựng app. Đọc hết trước khi code, làm theo **thứ tự giai đoạn** ở cuối file.

## 1. Mục tiêu

App mobile (Android + iOS) nghe âm thanh và hiển thị phụ đề dịch realtime, độ trễ thấp nhất có thể.

- Cặp ngôn ngữ chính: **Anh ⇄ Việt** (hai chiều + tự nhận diện).
- Ngôn ngữ khác: **gói tải thêm** trong app (không bắt buộc ở MVP).
- Hai chế độ dịch, người dùng tự chọn: **Cloud** và **Offline**.
- Nguồn âm thanh: **Mic**, hoặc **âm thanh của app khác** (ví dụ YouTube, Zoom) khi nền tảng cho phép.
- Hiển thị: trong app và **phụ đề nổi trên app khác**, kéo thả được vị trí.

## 2. Khả năng theo nền tảng (quan trọng)

| Tính năng                | Android                                                               | iOS                                                                                          |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Nghe mic                 | ✅                                                                    | ✅                                                                                           |
| Nghe âm thanh app khác   | ✅ AudioPlaybackCapture (Android 10+), **chọn được từng app** qua UID | ⚠️ Chỉ qua Broadcast Upload Extension (ReplayKit), nghe **toàn bộ** app, không chọn được app |
| Phụ đề nổi trên app khác | ✅ Overlay (`SYSTEM_ALERT_WINDOW`)                                    | ⚠️ Chỉ qua cửa sổ Picture-in-Picture                                                         |
| Offline STT + dịch       | ✅                                                                    | ✅ (trong app chính; **không** chạy trong Broadcast Extension vì giới hạn RAM ~50MB)         |

Ghi chú:

- App nguồn có thể chặn capture (`allowAudioPlaybackCapture=false`). Khi đó hiện thông báo và gợi ý dùng chế độ Mic.
- Chế độ **Mic** là phương án dự phòng chung: luôn chạy được trên cả hai nền tảng (nghe qua loa ngoài).

## 3. Tech stack

| Hạng mục     | Lựa chọn                                                                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | **Expo** (SDK mới nhất), **dev build** + `expo prebuild` (KHÔNG dùng Expo Go vì cần native module)                                                                                     |
| Ngôn ngữ     | TypeScript strict                                                                                                                                                                      |
| Điều hướng   | `expo-router`                                                                                                                                                                          |
| State        | **Zustand** (+ middleware `persist` dùng MMKV)                                                                                                                                         |
| Lưu trữ      | **react-native-mmkv** (settings, lịch sử, vị trí overlay, trạng thái gói ngôn ngữ)                                                                                                     |
| Styling      | **Tailwind** qua **NativeWind**                                                                                                                                                        |
| Server state | **TanStack Query** (lấy token cloud, danh mục gói ngôn ngữ, tải model)                                                                                                                 |
| Form         | TanStack Form (màn cài đặt / nhập API key)                                                                                                                                             |
| Offline STT  | `whisper.rn` (binding whisper.cpp) + VAD                                                                                                                                               |
| Offline dịch | Google **ML Kit On-device Translation** (có EN, VI và nhiều ngôn ngữ khác, tải theo gói) qua Expo module tự viết                                                                       |
| Cloud STT    | Streaming WebSocket. Provider cấu hình được (Deepgram / Soniox / OpenAI Realtime / Azure Speech Translation). Kiểm tra provider có hỗ trợ tiếng Việt streaming trước khi chọn mặc định |
| Cloud dịch   | Provider dịch đi kèm (nếu có) hoặc LLM / Google Translate API                                                                                                                          |
| Native code  | **Expo Modules API** (Kotlin + Swift), config plugin cho quyền và iOS extension                                                                                                        |
| Tải file     | `expo-file-system` (tải model, có resume)                                                                                                                                              |
| Lint/format  | ESLint flat config + Prettier (chi tiết ở mục 10)                                                                                                                                      |

### Bảo mật API key cloud

**Không nhúng API key provider vào app.** Có hai cách:

1. MVP: người dùng tự nhập API key của họ (lưu MMKV có mã hóa, `encryptionKey` lấy từ `expo-secure-store`).
2. Bản phát hành: backend **NestJS** nhỏ cấp **token tạm thời** (short-lived) cho app gọi thẳng provider. App lấy token qua TanStack Query.

## 4. Pipeline & chiến lược độ trễ thấp

```
Audio (PCM 16kHz mono, frame 20–100ms)
  → VAD (cắt đoạn im lặng)
  → STT streaming  ──► partial text (hiện mờ, cập nhật liên tục)
                   ──► final segment
  → Dịch theo cụm   ──► bản dịch (thay partial)
  → Overlay / màn hình trong app
```

Quy tắc độ trễ:

- Audio gửi đi liên tục theo frame nhỏ, không gom thành đoạn dài.
- **Dịch sớm**: không đợi hết câu. Dịch khi có dấu câu, khi im lặng ≥ 300–500ms, hoặc khi câu dài quá N từ (mặc định 12).
- Hiển thị partial transcript ngay, bản dịch thay vào khi có.
- Cloud: giữ một WebSocket mở suốt phiên, có keep-alive, tự reconnect.
- Offline: whisper chạy theo cửa sổ trượt 3–5s với VAD, model mặc định `base` (đa ngữ, lượng tử hóa q5/q8). Có tùy chọn `tiny` cho máy yếu và `small` cho độ chính xác cao. ML Kit dịch gần như tức thì.
- Đo và log độ trễ từng bước (capture → STT → dịch → render) để tối ưu. Có màn debug hiển thị số liệu này.

Mục tiêu: Cloud ~1s, Offline ~2–3s (tùy máy).

## 5. Native modules

Đặt trong `modules/` (Expo local modules).

### 5.1 `audio-capture`

- API JS:
  - `start({ source: 'mic' | 'app', targetPackage?: string, sampleRate: 16000 })`
  - `stop()`
  - `listCapturableApps()` (Android)
  - Event `onAudioFrame` (PCM base64 hoặc ArrayBuffer qua JSI nếu được), `onError`, `onStateChange`
- **Android**
  - Mic: `AudioRecord`.
  - App khác: `MediaProjection` (xin đồng ý mỗi phiên) + `AudioPlaybackCaptureConfiguration.addMatchingUid(uid)`, usage `MEDIA | GAME | UNKNOWN`.
  - Chạy trong **Foreground Service** với `foregroundServiceType="mediaProjection|microphone"` (bắt buộc Android 14+), notification có nút Dừng.
  - `listCapturableApps()`: trả về app đã cài có launcher (tên, package, icon), ưu tiên YouTube, Chrome, Zoom, Meet, Teams lên đầu.
- **iOS**
  - Mic: `AVAudioEngine`, audio session `.playAndRecord` + `.mixWithOthers`, background mode `audio`.
  - App khác: xem 5.4 (giai đoạn 4).

### 5.2 `subtitle-overlay` (Android)

- Overlay native (`WindowManager`, `TYPE_APPLICATION_OVERLAY`) hiển thị `TextView`, **không** render RN trong overlay để nhẹ và mượt.
- API:
  - `show()`, `hide()`
  - `setText({ original, translated, isPartial })`
  - `setStyle({ fontSize, textColor, bgColor, bgOpacity, maxLines, showOriginal })`
  - `setEditMode(boolean)`
  - Event `onPositionChange({ x, y, width })`
- Chế độ thường: `FLAG_NOT_TOUCHABLE` (chạm xuyên qua, không cản thao tác app bên dưới).
- Chế độ chỉnh: chạm được, kéo thả và kéo giãn chiều rộng. Có nút ✓ để khóa lại.
- Vị trí lưu MMKV theo hướng màn hình (dọc/ngang).
- Xin quyền "Hiển thị trên ứng dụng khác" với màn giải thích trước.

### 5.3 `ml-translate`

- Bọc ML Kit Translation cho cả Android và iOS.
- API:
  - `translate(text, from, to)`
  - `downloadModel(lang, { wifiOnly })`, `deleteModel(lang)`, `listDownloadedModels()`
  - `identifyLanguage(text)` (ML Kit Language ID, dùng cho chế độ tự nhận diện)

### 5.4 iOS: nghe app khác + PiP (giai đoạn 4)

- **Broadcast Upload Extension** (thêm bằng config plugin) nhận `RPSampleBufferType.audioApp`.
- Extension giới hạn RAM nên **chỉ hỗ trợ Cloud**: extension tự stream audio lên cloud STT, ghi kết quả vào **App Group** (`UserDefaults(suiteName:)` hoặc file chung) + Darwin notification.
- App chính nhận kết quả, dịch, và hiển thị phụ đề trong **Picture-in-Picture** (`AVPictureInPictureController` + `AVSampleBufferDisplayLayer` render khung chữ).
- Người dùng bật từ nút `RPSystemBroadcastPickerView` trong app.
- Rủi ro duyệt App Store: mô tả rõ mục đích "phụ đề trợ năng" trong review notes.

## 6. Chức năng & màn hình (flow)

1. **Onboarding** (lần đầu)
   - Giới thiệu ngắn → chọn chiều dịch mặc định (EN→VI).
   - Chọn chế độ: Cloud (nhập API key / đăng nhập) hoặc Offline (tải model whisper + gói ML Kit EN/VI, có thanh tiến trình, gợi ý Wi-Fi).
   - Xin quyền Mic. Quyền overlay (Android) xin khi người dùng bật overlay lần đầu.
2. **Home**
   - Chọn **Nguồn**: Mic / App khác (Android: chọn app từ danh sách; iOS: nút phát sóng).
   - Chọn **Chiều dịch**: EN→VI, VI→EN, Tự nhận diện.
   - Chọn **Chế độ**: Cloud / Offline (disable Offline nếu chưa tải gói).
   - Nút lớn **Bắt đầu / Dừng**.
   - Toggle **Phụ đề nổi**.
3. **Phiên dịch (Live)**
   - Danh sách song ngữ cuộn realtime (gốc nhỏ, mờ; bản dịch lớn), partial in nghiêng.
   - Hiển thị độ trễ hiện tại và trạng thái kết nối.
   - Khi thoát app ra YouTube: dịch vẫn chạy (foreground service / background audio), phụ đề nổi hiển thị.
4. **Chỉnh phụ đề nổi**
   - Bấm "Chỉnh vị trí" → kéo thả trực tiếp trên màn hình.
   - Tùy chỉnh cỡ chữ, màu, độ mờ nền, số dòng, hiện/ẩn bản gốc. Có preview trong app.
5. **Lịch sử**
   - Danh sách phiên (ngày, thời lượng, nguồn).
   - Xem lại, tìm kiếm, xuất **TXT / SRT**, chia sẻ.
6. **Gói ngôn ngữ**
   - Danh sách ngôn ngữ: đã tải / có thể tải, dung lượng, nút tải/xóa.
   - Model whisper: tiny / base / small.
7. **Cài đặt**
   - Provider cloud + API key.
   - Ngưỡng ngắt câu (độ nhạy dịch sớm).
   - Chỉ tải qua Wi-Fi, giao diện sáng/tối, ngôn ngữ giao diện (VI/EN).
   - Màn debug độ trễ.

## 7. State (Zustand) & lưu trữ (MMKV)

Mỗi store một file trong `src/stores/`. Store cần lưu dùng `persist` + `createJSONStorage` với adapter MMKV.

- `useSettingsStore` (persist): `direction`, `engine: 'cloud' | 'offline'`, `cloudProvider`, `whisperModel`, `segmentation { silenceMs, maxWords }`, `theme`, `uiLang`, `wifiOnly`.
- `useOverlayStore` (persist): `enabled`, `position { portrait, landscape }`, `style`.
- `useSessionStore` (KHÔNG persist): `status`, `source`, `segments[]` (id, original, translated, isPartial, timestamps), `latency`.
- `useHistoryStore` (persist): phiên đã kết thúc. Lưu mỗi phiên một key MMKV riêng (`session:<id>`) + index danh sách, tránh một JSON khổng lồ.
- `useLanguagePackStore` (persist): trạng thái các gói đã tải, tiến trình tải.

MMKV:

- Instance `storage` chung + instance `secure` có `encryptionKey` (key sinh ngẫu nhiên lần đầu, lưu `expo-secure-store`) cho API key.

## 8. Kiến trúc engine (TypeScript)

Interface chung để đổi qua lại Cloud/Offline không ảnh hưởng UI:

```ts
interface SttEngine {
  start(opts: { lang: LangCode | 'auto' }): Promise<void>;
  pushAudio(frame: PcmFrame): void;
  stop(): Promise<void>;
  onPartial(cb: (text: string) => void): Unsubscribe;
  onFinal(cb: (seg: { text: string; lang: LangCode }) => void): Unsubscribe;
}

interface Translator {
  translate(text: string, from: LangCode, to: LangCode): Promise<string>;
}
```

- `src/engine/stt/cloud/*`, `src/engine/stt/offline/whisper.ts`
- `src/engine/translate/cloud/*`, `src/engine/translate/offline/mlkit.ts`
- `src/engine/pipeline.ts`: nối audio-capture → STT → segmenter → translator → `useSessionStore` + `subtitle-overlay`.
- `src/engine/segmenter.ts`: logic "dịch sớm" (dấu câu, im lặng, max words).
- Dịch chạy song song nhưng **giữ đúng thứ tự** hiển thị (đánh số segment).

## 9. Cấu trúc thư mục

```
app/                      # expo-router
  (onboarding)/
  (tabs)/index.tsx        # Home
  (tabs)/history.tsx
  (tabs)/settings.tsx
  live.tsx
  overlay-editor.tsx
  language-packs.tsx
  history/[id].tsx
src/
  components/ui/          # Button, Card, Toggle... (NativeWind)
  engine/                 # pipeline, stt, translate, segmenter
  stores/
  lib/storage.ts          # MMKV instances + zustand storage adapter
  lib/query.ts            # QueryClient
  api/                    # TanStack Query hooks (token, model catalog)
  hooks/
  i18n/                   # chuỗi giao diện VI/EN
  utils/srt.ts
modules/
  audio-capture/
  subtitle-overlay/
  ml-translate/
plugins/                  # config plugins (quyền Android, iOS broadcast extension, App Group)
```

## 10. ESLint & chất lượng code

- ESLint **flat config** (`eslint.config.js`):
  - `eslint-config-expo` (flat)
  - `typescript-eslint` (strict + type-checked)
  - `eslint-plugin-react`, `eslint-plugin-react-hooks`
  - `eslint-plugin-import` (sắp xếp import, cấm import vòng)
  - `eslint-plugin-tailwindcss` hoặc tương đương tương thích NativeWind (nếu xung đột thì bỏ, ưu tiên `prettier-plugin-tailwindcss` để sắp class)
  - `eslint-config-prettier` + Prettier
- Scripts: `lint`, `lint:fix`, `typecheck` (`tsc --noEmit`), `format`.
- Husky + lint-staged chạy lint/format trước commit.
- Không có lỗi lint hoặc type ở mỗi giai đoạn trước khi chuyển sang giai đoạn sau.

## 11. Quyền & cấu hình

**Android** (qua config plugin):

- `RECORD_AUDIO`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PROJECTION`, `FOREGROUND_SERVICE_MICROPHONE`, `SYSTEM_ALERT_WINDOW`, `POST_NOTIFICATIONS`, `INTERNET`
- `QUERY_ALL_PACKAGES` **không dùng** (Play Store hạn chế); dùng `<queries>` với intent launcher.
- minSdk 29 (Android 10).

**iOS**:

- `NSMicrophoneUsageDescription`, `UIBackgroundModes: [audio]`
- Giai đoạn 4: target Broadcast Upload Extension, App Group.
- iOS tối thiểu 15.

## 12. Lộ trình

1. **Khung dự án**: Expo + TS + expo-router + NativeWind + Zustand + MMKV + TanStack Query + ESLint/Prettier/Husky. UI các màn hình với dữ liệu giả.
2. **MVP Cloud + Mic** (Android & iOS): `audio-capture` (mic), cloud STT streaming, dịch, màn Live, lịch sử, xuất SRT.
3. **Android nâng cao**: capture app khác + foreground service, `subtitle-overlay`, màn chỉnh overlay.
4. **Offline**: `whisper.rn` + VAD, `ml-translate`, màn gói ngôn ngữ, tải model.
5. **iOS app khác**: Broadcast Extension + PiP (chỉ Cloud).
6. **Backend NestJS cấp token tạm thời** cho bản phát hành.

Mỗi giai đoạn: chạy được trên thiết bị thật, đo độ trễ, lint/typecheck sạch.

## 13. Cần test thực tế sớm

- YouTube app trên Android có cho AudioPlaybackCapture không (nếu không: hướng dẫn mở YouTube trong Chrome, hoặc dùng Mic).
- Chất lượng whisper `base` với tiếng Việt trên máy tầm trung; cân nhắc `small` nếu kém.
- Provider cloud nào cho độ trễ tiếng Việt tốt nhất (làm màn debug độ trễ trước để so sánh).
