# SlimSprint

Одностраничный лендинг проекта персонального питания SlimSprint.

Исходники размещены в `docs/`, публикация — через GitHub Actions (`.github/workflows/pages.yml`).

## Структура

- `docs/index.html` — лендинг.
- `docs/privacy-policy.html` — политика обработки персональных данных.

## Локальный запуск

```sh
npx serve docs
```

## Служебные скрипты

- `scripts/gh-git.sh` — git с токеном из переменной `GH_TOKEN`.