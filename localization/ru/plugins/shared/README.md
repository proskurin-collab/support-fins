# Support Fins — общий код плагинов

Здесь находится код, общий для всех плагинов с поддержкой JavaScript. Они запускают
**движок сайта (`web/*.js`) без изменений**, поэтому не содержат отдельной копии
геометрического ядра. Исправление сайта попадает в плагин при следующей сборке.

```
engine/fins_entry.js    треугольники детали (мм, Z вверх) -> треугольники рёбер и площадки
engine/bridge.js        обмен base64 для Python-хостов, запускающих сборку в V8 (mini-racer)
bundle.py               сборка bridge.js + web/*.js через esbuild в один IIFE SupportFinsEngine
tests/                  тесты Deno: совпадение с сайтом в любой точке стола и проверка base64
ENGINE-SENSITIVITY.md   заметка о чувствительности перемычек к шуму 1e-13 мм и стабилизации
```

```
python3 plugins/shared/bundle.py out.js     # нужен esbuild (npx загрузит его при необходимости)
deno test --allow-read plugins/shared/tests/
```

Используется плагином [Orca](../orca/README.md), который встраивает сборку в один файл.
Onshape (FeatureScript) и Prusa (Lua) не могут запускать JavaScript, поэтому этот код
не используют.

CI [`.github/workflows/plugins.yml`](../../.github/workflows/plugins.yml) собирает и
тестирует плагины при каждом PR и push, затрагивающем `web/` или `plugins/`. В исходном
репозитории push в `main` также публикует предварительный rolling release `plugins-latest`.
