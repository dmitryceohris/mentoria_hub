# Mentoria Hub

Mentoria Hub is an EdTech product for students in grades 8-11. The core workflow helps students search for and match with educational opportunities such as competitions, scholarships, internships, summer schools, and events. Courses, MentorLM, roadmap planning, recommendations, and admin operations support that opportunity-matching flow.

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
- Supabase
- React Router
- Framer Motion
- Phosphor Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set the required browser-safe Supabase variables in `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Start the development server:

```bash
npm run dev
```

## Scripts

```bash
npm run dev                    # Start Vite dev server
npm run build                  # Typecheck and build production assets
npm run preview                # Preview the production build locally
npm run typecheck              # Run TypeScript project checks
npm run check:recommendations  # Validate recommendation catalog quality
npm run seed:admin-catalog     # Seed Supabase admin catalog tables
```

## Environment Notes

Use `VITE_SUPABASE_PUBLISHABLE_KEY` for the browser app. `VITE_SUPABASE_ANON_KEY` is supported as a legacy fallback, but new deployments should prefer the publishable key.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or any other secret/server key through a `VITE_` variable. Vite variables are bundled into browser code.

For Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the project environment variables for Production, Preview, and Development as needed.

## Project Structure

- `src/sections` - page-level product sections and workspaces.
- `src/components` - reusable UI components.
- `src/lib` - Supabase clients, auth, admin helpers, recommendation logic, roadmap, and MentorLM utilities.
- `src/data` - static product content, courses, onboarding questions, and curated opportunities.
- `public/recsys` - public recommendation datasets and embeddings.
- `scripts` - local/server-side maintenance scripts.

## Admin Panel Guide

The admin panel is available at `/admin`. Sign in as a regular user first, then open `/admin`.

Admin access is controlled by the `admin_memberships` Supabase table. The current user must have an active membership row. Without it, the app shows `Access restricted`.

### Roles

- `admin` - can edit the catalog, review assignments, inspect MentorLM notes, and manage staff.
- `content_editor` - can edit courses and opportunities in the catalog.
- `mentor` - can review assignments and inspect MentorLM notes.

### Bootstrap The First Admin

1. Create a user through Supabase Auth or sign up through the app.
2. Copy that user's Supabase Auth UUID.
3. In the Supabase SQL editor or table editor, insert an active admin membership:

```sql
insert into public.admin_memberships (user_id, role, status)
values ('<supabase-auth-user-uuid>', 'admin', 'active')
on conflict (user_id)
do update set role = 'admin', status = 'active';
```

4. Sign in as that user and open `/admin`.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not place it in `.env` as a `VITE_` variable and do not expose it in deployed browser environments.

### Admin Workflows

- Overview - refresh admin data and seed the admin catalog from static content.
- Courses - create courses and edit course metadata, lessons, videos, assignments, materials, quizzes, and MentorLM note settings.
- Opportunities - edit title, category, direction, format, deadline, location, grades, tags, requirements, status, and apply URL.
- Assignments - filter submissions, review answers, set score, leave feedback, mark reviewed, or request revision.
- MentorLM Notes - inspect saved student lesson notes.
- Staff - add or update staff by Supabase Auth user UUID, role, and status.

### Seeding The Admin Catalog

The admin catalog can be seeded from the static content in `src/data/content.ts`:

```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npm run seed:admin-catalog
```

`VITE_SUPABASE_URL` can be used instead of `SUPABASE_URL`, but `SUPABASE_SERVICE_ROLE_KEY` is still required because this is a server-side script that writes catalog rows.

## Русская версия

Mentoria Hub - EdTech-продукт для учеников 8-11 классов. Главный сценарий помогает школьникам искать и подбирать образовательные возможности: олимпиады, стипендии, стажировки, летние школы и события. Курсы, MentorLM, roadmap, рекомендации и админ-процессы поддерживают этот сценарий подбора возможностей.

## Технологии

- React 19
- Vite 8
- TypeScript 6
- Supabase
- React Router
- Framer Motion
- Phosphor Icons

## Запуск

Установите зависимости:

```bash
npm install
```

Создайте локальный env-файл:

```bash
cp .env.example .env
```

Заполните browser-safe переменные Supabase в `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Запустите dev-сервер:

```bash
npm run dev
```

## Скрипты

```bash
npm run dev                    # Запуск Vite dev server
npm run build                  # Typecheck и production build
npm run preview                # Локальный просмотр production build
npm run typecheck              # Проверка TypeScript
npm run check:recommendations  # Проверка качества recommendation-каталога
npm run seed:admin-catalog     # Seed Supabase-таблиц админ-каталога
```

## Переменные окружения

Для браузерного приложения используйте `VITE_SUPABASE_PUBLISHABLE_KEY`. `VITE_SUPABASE_ANON_KEY` поддерживается как legacy fallback, но для новых деплоев лучше использовать publishable key.

Никогда не добавляйте `SUPABASE_SERVICE_ROLE_KEY` или другие секретные/server-side ключи в переменные с префиксом `VITE_`. Такие переменные попадают в браузерный bundle.

Для Vercel добавьте `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY` в environment variables проекта для Production, Preview и Development по необходимости.

## Структура проекта

- `src/sections` - секции продукта и рабочие пространства.
- `src/components` - переиспользуемые UI-компоненты.
- `src/lib` - Supabase-клиенты, auth, admin helpers, рекомендации, roadmap и MentorLM utilities.
- `src/data` - статический контент продукта, курсы, onboarding-вопросы и curated opportunities.
- `public/recsys` - публичные datasets и embeddings для рекомендаций.
- `scripts` - локальные/server-side maintenance scripts.

## Гайд по админ-панели

Админ-панель доступна по адресу `/admin`. Сначала войдите в приложение как обычный пользователь, затем откройте `/admin`.

Доступ управляется таблицей Supabase `admin_memberships`. У текущего пользователя должна быть активная запись. Если записи нет, приложение покажет `Access restricted`.

### Роли

- `admin` - редактирует каталог, проверяет задания, смотрит заметки MentorLM и управляет staff.
- `content_editor` - редактирует курсы и opportunities в каталоге.
- `mentor` - проверяет задания и смотрит заметки MentorLM.

### Создание первого админа

1. Создайте пользователя через Supabase Auth или зарегистрируйтесь через приложение.
2. Скопируйте Supabase Auth UUID этого пользователя.
3. В Supabase SQL editor или table editor добавьте активную admin membership:

```sql
insert into public.admin_memberships (user_id, role, status)
values ('<supabase-auth-user-uuid>', 'admin', 'active')
on conflict (user_id)
do update set role = 'admin', status = 'active';
```

4. Войдите под этим пользователем и откройте `/admin`.

Храните `SUPABASE_SERVICE_ROLE_KEY` только на server-side. Не добавляйте его в `.env` как `VITE_` переменную и не раскрывайте его в браузерных окружениях деплоя.

### Рабочие сценарии админки

- Overview - обновить admin data и засеять admin catalog из static content.
- Courses - создавать курсы и редактировать metadata, lessons, videos, assignments, materials, quizzes и настройки MentorLM notes.
- Opportunities - редактировать title, category, direction, format, deadline, location, grades, tags, requirements, status и apply URL.
- Assignments - фильтровать submissions, проверять ответы, выставлять score, оставлять feedback, отмечать reviewed или request revision.
- MentorLM Notes - смотреть сохраненные student lesson notes.
- Staff - добавлять или обновлять staff по Supabase Auth user UUID, role и status.

### Seed админ-каталога

Админ-каталог можно засеять из статического контента в `src/data/content.ts`:

```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npm run seed:admin-catalog
```

Вместо `SUPABASE_URL` можно использовать `VITE_SUPABASE_URL`, но `SUPABASE_SERVICE_ROLE_KEY` все равно нужен: это server-side script, который записывает строки каталога.
