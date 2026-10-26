@AGENTS.md

# CLAUDE.md — LiveSub

App mobile (Android + iOS) dịch giọng nói realtime, hiển thị phụ đề song ngữ (EN ⇄ VI), chế độ Cloud / Offline, nguồn Mic hoặc âm thanh app khác, phụ đề nổi trên app khác.

## Tài liệu bắt buộc đọc

| File                                   | Vai trò                                                                                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [design.md](design.md)                 | **Kiến trúc code** của source: tech stack, pipeline, native modules, stores, engine, cấu trúc thư mục, lộ trình giai đoạn. Mọi code mới phải theo đúng kiến trúc này. |
| [AGENTS.md](AGENTS.md)                 | Quy tắc Expo (đọc docs theo version, dùng `expo install`, CNG...).                                                                                                    |
| [docs/instruction/](docs/instruction/) | Logic cụ thể của từng chức năng.                                                                                                                                      |
| [docs/changelog/](docs/changelog/)     | Lịch sử sửa đổi theo ngày của từng logic.                                                                                                                             |

## Trạng thái source hiện tại

- **Xong giai đoạn 1** (`design.md` mục 12): khung dự án + UI mọi màn với dữ liệu giả (mock STT / dịch / danh mục gói / danh sách app). Tiếp theo: giai đoạn 2.
- Expo SDK **58**, React Native 0.88, React 19.3, TypeScript 6 (`strict: true`).
- Package manager: **npm** (có `package-lock.json`) → dùng `npx`, không dùng `bunx`.
- `app.json`: bật `experiments.typedRoutes` và `experiments.reactCompiler`; `web.output: "server"`.
- Stack đã có: NativeWind 4 (Tailwind 3.4), Zustand 5 + MMKV 4 (Nitro, **cần dev build**), TanStack Query + Form, expo-secure-store, expo-file-system, ESLint flat + Prettier + Husky/lint-staged.
- Routes: `(onboarding)/`, `(tabs)/{index,history,settings}`, `live`, `overlay-editor`, `language-packs`, `history/[id]`, `debug` (thêm `debug` cho màn debug độ trễ).
- i18n ở `src/i18n/{vn,en}.json` + hook `useLanguage()`; icon ở `src/components/Icons/` (bọc expo-symbols); ảnh ở `src/config/images.ts`.
- Chi tiết từng logic: xem `docs/instruction/`.
- Chưa có `ios/`, `android/`, `modules/`, `plugins/`.

## Khác biệt giữa design.md và source (theo source)

- Routes nằm ở **`src/app/`** (không phải `app/` ở root như mục 9 của design.md). Toàn bộ cây `app/` trong design.md hiểu là `src/app/`.
- Path alias: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`. Luôn import bằng alias, không dùng `../../`.
- `modules/` và `plugins/` đặt ở **root** project (cùng cấp `src/`).

## Rules

### 0. Xóa bất cứ thứ gì → PHẢI xin phép dev trước

- **Bắt buộc** hỏi và chờ dev đồng ý trước khi xóa: file, folder, code (function, component, logic, đoạn code lớn), dependency, route, store, key MMKV, docs (instruction / changelog), branch / commit git.
- Khi xin phép phải nêu rõ: **xóa cái gì**, **vì sao**, **ảnh hưởng gì**.
- Không tự ý xóa kể cả khi thấy thừa / không dùng / để refactor. Chỉ được đề xuất, không được làm.
- Đồng ý cho lần xóa này không có nghĩa là được xóa lần sau — mỗi lần xóa xin phép lại.

### 1. Quy trình bắt buộc trước khi làm bất cứ việc gì

1. Đọc `design.md` phần liên quan đến việc cần làm.
2. Vào `docs/instruction/` tìm folder logic liên quan → đọc để hiểu dev đang muốn **thêm / sửa / update** chức năng gì và logic hiện tại ra sao.
3. Vào `docs/changelog/` đọc changelog của logic đó để biết đã sửa gì gần đây, tránh làm lại hoặc phá logic cũ.
4. Nếu yêu cầu mâu thuẫn với `design.md` hoặc instruction → **hỏi lại dev** trước khi code.
5. Làm xong → cập nhật `docs/instruction/` và `docs/changelog/` (xem mục 2, 3).

### 2. `docs/instruction/` — logic cụ thể

- Mỗi logic một **folder**, đặt tên theo tên logic, dạng `kebab-case` dễ đọc. Các logic nhỏ liên quan tới nhau **gộp chung** vào một folder.
  - Ví dụ: `audio-capture/`, `cloud-stt/`, `segmenter/`, `subtitle-overlay/`, `history-export/`, `language-packs/`, `settings/`.
- Trong mỗi folder có `README.md` mô tả:
  - Mục đích chức năng.
  - Luồng xử lý (input → xử lý → output), quy tắc / edge case.
  - File code liên quan (đường dẫn).
  - Phụ thuộc với logic khác (link tới folder instruction khác).
- Khi thêm logic mới → tạo folder mới. Khi sửa logic → cập nhật `README.md` cho khớp code. Instruction luôn phản ánh **logic hiện tại**, không ghi lịch sử (lịch sử để ở changelog).

### 3. `docs/changelog/` — lịch sử sửa đổi

- Mỗi logic một file `docs/changelog/<logic-name>.md`, **cùng tên** với folder trong `docs/instruction/`.
- Mỗi ngày một heading `## YYYY-MM-DD`, ngày mới nhất ở **trên cùng**. Sửa nhiều lần trong một ngày vẫn chỉ **một** heading ngày đó, thêm dòng vào dưới.
- Mỗi dòng một thay đổi logic, ngắn gọn: cái gì đổi → tác dụng (file).
- Format:

```md
# Changelog — <Logic Name>

## 2026-10-21

- <what changed> → <effect> (<file.ts>)
- Fix: <what was wrong> → <now> (<file.ts>)

## 2026-10-19

- ...
```

### 4. Code

- Theo đúng kiến trúc `design.md`: store trong `src/stores/` (mỗi store 1 file), engine trong `src/engine/`, native module trong `modules/` (Expo Modules API), config plugin trong `plugins/`.
- Code không phải route (components, hooks, utils, stores, engine) **không** đặt trong `src/app/`.
- UI và engine giao tiếp qua interface `SttEngine` / `Translator` — UI không gọi trực tiếp provider hay native module.
- React Compiler đang bật → không thêm `useMemo` / `useCallback` / `React.memo` thủ công trừ khi có lý do đo được.
- Typed routes đang bật → dùng đường dẫn route có kiểu, không ghép chuỗi tùy ý.
- Đặt tên file `kebab-case` (theo template: `themed-text.tsx`, `use-theme.ts`). File riêng theo nền tảng dùng hậu tố `.web.tsx`, `.ios.tsx`, `.android.tsx`.
- Không nhúng API key provider vào code (xem design.md mục 3 "Bảo mật API key cloud").
- Chuỗi giao diện đi qua `src/i18n/` (VI/EN), không hard-code (từ giai đoạn 1 trở đi).
- Không tạo / sửa tay `ios/`, `android/` — cấu hình native qua `app.json` và config plugin.

### 5. Thêm thư viện

- Luôn `npx expo install <package>`, không `npm install`.
- Thư viện có native code → cần dev build (`npx expo run:ios|android`), Expo Go không chạy được.
- Chỉ thêm thư viện có trong tech stack `design.md`; thư viện ngoài danh sách → hỏi dev trước.

### 6. Trước khi báo xong

```bash
npx expo lint
npx tsc --noEmit
```

Không còn lỗi lint / type, đã cập nhật `docs/instruction/` và `docs/changelog/`.
