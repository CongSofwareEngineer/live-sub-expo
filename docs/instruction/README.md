# Instruction

Mỗi logic một folder (`kebab-case`, đặt theo tên logic). Logic nhỏ liên quan nhau gộp chung một folder.

Mẫu `docs/instruction/<logic-name>/README.md`:

```md
# <Logic Name>

## Mục đích

...

## Luồng xử lý

input → xử lý → output. Quy tắc, edge case.

## File liên quan

- `src/...`

## Phụ thuộc

- [<logic khác>](../<logic-khac>/README.md)
```
