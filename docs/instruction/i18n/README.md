# i18n

## Mục đích

Mọi chuỗi giao diện đi qua VI/EN (skill `language`, đặt theo design.md: `src/i18n/`).

## Luồng xử lý

- `src/i18n/vn.json`, `src/i18n/en.json`: cùng cấu trúc key (dot notation).
- `translate(lang, key, vars?, defaultMessage?)` trong `src/i18n/index.ts`: tra key → thay `{name}` bằng `vars`. Không thấy key → `defaultMessage` → key.
- Hook `useLanguage()` (`src/hooks/use-language.ts`) trả `{ translate, lang, locale, setLanguage }`. Ngôn ngữ lưu ở `useSettingsStore.uiLang` (mặc định theo locale máy).
- Type `TranslationKey` sinh từ `vn.json`; `en.json` được ép cùng kiểu → **tsc báo lỗi nếu en thiếu key**.

## Quy tắc / edge case

- Thêm key phải thêm vào **cả hai** file.
- Key động (`languages.${code}`) cần ép `as TranslationKey` + `defaultMessage`.
- Chưa hỗ trợ biến dạng ReactNode (render function) như skill gốc — chỉ string/number.

## File liên quan

- `src/i18n/index.ts`, `src/i18n/vn.json`, `src/i18n/en.json`, `src/hooks/use-language.ts`

## Phụ thuộc

- [settings](../settings/README.md) (`uiLang`)
