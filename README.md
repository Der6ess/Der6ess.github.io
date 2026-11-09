# Personal Discipline

Репозиторий: https://github.com/Der6ess/Der6ess.github.io

Сайт после успешного деплоя: https://der6ess.github.io/

React + Vite + TypeScript. Правила, фото и видео. GitHub Actions собирает сайт и публикует его в GitHub Pages после каждого push в main.

## Однократная настройка GitHub

В репозитории должны лежать **исходники проекта**, а не содержимое dist: package.json, package-lock.json, index.html, vite.config.ts, tsconfig.json, src/, public/, scripts/, media/, .github/ и .gitignore.

GitHub → репозиторий → Settings → Pages → Source → **GitHub Actions**. Сохраните настройку, если интерфейс предлагает кнопку Save. Публикация из ветки больше не нужна.

После первого push откройте Actions → Build and deploy Pages. Дождитесь успешных build и deploy. Адрес сайта будет в Settings → Pages и в результате deploy. Рабочий процесс публикует сайт целиком: удалённые из media/ файлы исчезают и из новой версии сайта.

Если раньше в репозитории лежал только готовый сайт, его нужно заменить исходным проектом, сохранив историю Git. Не копируйте старую папку .git поверх другой. Привязка локального проекта требует URL репозитория и настроенного доступа к GitHub через SSH или менеджер учётных данных. Пароли и токены не помещайте в исходники и не отправляйте в чат.

## Локальный запуск

Нужен Node.js 22 и npm.

```bash
npm install
npm run dev
```

Также работает `npm start`. Адрес покажет терминал. Ctrl+C останавливает сервер.

## Добавить или удалить медиа

1. Положите фото/видео в media/ или удалите ненужные файлы.
2. Запустите `npm run dev`: перед запуском автоматически обновятся список и копии файлов. Если dev-сервер уже работает, после изменения коллекции выполните `npm run media:sync` и обновите страницу.
3. Сохраните изменения в Git и отправьте:

```bash
git add .
git commit -m "Update media"
git push origin main
```

Дальше GitHub сам установит зависимости, обновит коллекцию, проверит TypeScript, соберёт и опубликует сайт. Вручную загружать dist не нужно.

Поддерживаются MP4, WebM, MOV, JPG, JPEG, PNG, WebP, GIF, AVIF. Рекомендуется MP4 H.264/AAC, поскольку MOV не во всех браузерах работает одинаково. В GitHub каждый файл должен быть меньше 100 МиБ; крупные видео предварительно сжимайте.

Исходные файлы media/ теперь входят в Git: иначе на GitHub не из чего собрать коллекцию. public/videos/, src/config/media.ts и dist/ генерируются автоматически, их коммитить не нужно. Не редактируйте src/config/media.ts вручную.

## Изменить правила и оформление

- src/config/rules.ts — заголовки и описания правил.
- src/main.tsx — главный заголовок и структура страницы.
- src/style.css — цвета, отступы и размеры.
- src/Player.tsx — плеер и вертикальная лента.

После правок используйте те же `git add .`, `git commit` и `git push origin main`.

## Проверить сборку до отправки

```bash
npm run build
npm run preview
```

`npm run build` автоматически запускает media:sync. Для проверки без сборки: `npm run media:sync`.

## Использование

Стрелки и горизонтальные свайпы меняют медиа. Иконка разворачивания открывает вертикальную ленту; крестик или Escape возвращает назад. Позиция видео и звук сохраняются между режимами в памяти страницы, но не после перезагрузки. Браузер может запретить автозапуск со звуком — тогда включите звук кнопкой.

Загружается только текущий файл: остальные плееры не создаются заранее. Короткое активное видео браузер может скачать целиком для буфера.

## Хранение и доступ

Сайт и медиа публичны. Исходники хранятся в репозитории, готовый сайт — в GitHub Pages. Секреты, .env, node_modules и сборки исключены через .gitignore. Сохраняйте отдельную резервную копию исходных видео: удаление файла из Git не удаляет его из истории.

Бесплатный GitHub Pages имеет лимиты: опубликованный сайт до 1 ГБ, мягкий лимит трафика 100 ГБ/месяц. Это не безлимитное видеохранилище.

Документация публикации: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Если публикация не прошла

Откройте Actions и первый красный шаг. Если ошибка в npm ci, убедитесь, что package-lock.json закоммичен вместе с package.json. Если deploy не разрешён, проверьте Settings → Pages → GitHub Actions и разрешения Actions в настройках репозитория. Workflow ожидает ветку main.

## Перенос текущего проекта в существующий репозиторий

В этой среде GitHub недоступен по сети, а .git предоставлен только для чтения. Чтобы сохранить историю существующего репозитория, выполните один раз в обычном терминале WSL:

```bash
git clone https://github.com/Der6ess/Der6ess.github.io.git /home/jeff/discipline-github
cp -r /home/jeff/personal-discipline/{src,public,scripts,media,.github,.gitignore,.env.example,index.html,package.json,package-lock.json,tsconfig.json,vite.config.ts,README.md} /home/jeff/discipline-github/
cd /home/jeff/discipline-github
git add .
git commit -m "Build and deploy source with GitHub Actions"
git push origin HEAD:main
```

Если папка discipline-github уже существует, не удаляйте её вслепую: выберите другое имя для клона и замените его в командах. Если Git просит настроить имя и email, используйте свои данные командой git config внутри нового клона. Для push нужен настроенный вход в GitHub (Git Credential Manager или SSH); обычный пароль GitHub для HTTPS push не подходит.

Затем https://github.com/Der6ess/Der6ess.github.io/settings/pages → Source → GitHub Actions. Проверка: https://github.com/Der6ess/Der6ess.github.io/actions . Если до push рабочий процесс ещё не был запущен с нужной настройкой Pages, перезапустите его через Actions → Build and deploy Pages → Run workflow.

После переноса редактируйте **/home/jeff/discipline-github**, чтобы изменения и Git находились в одной папке. Старые опубликованные assets/videos в корне исходного репозитория не используются workflow: он публикует исключительно свежий dist. Их можно удалить отдельным коммитом после проверки первого автоматического деплоя.
