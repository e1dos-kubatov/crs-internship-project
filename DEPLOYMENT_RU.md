# Деплой проекта Car Rental

Цель: frontend на Netlify, backend на Render, PostgreSQL база на Neon.

## 1. Что уже подготовлено в репозитории

- `netlify.toml` говорит Netlify, что frontend лежит в папке `frontend`, билдится командой `npm run build`, а готовые файлы находятся в `frontend/dist`.
- `render.yaml` говорит Render, что backend нужно запускать как Docker web service из `car-rental-backend/Dockerfile`.
- `car-rental-backend/src/main/resources/application.properties` теперь берет production-настройки из env-переменных, а не из hardcoded секретов.
- `frontend/src/api/client.js` по умолчанию смотрит на `https://crs-internship-project-1.onrender.com/api`.

## 2. Neon PostgreSQL

1. Откройте Neon и создайте новый Project.
2. В Project Dashboard нажмите `Connect`.
3. Скопируйте host, database, user и password.
4. Для Render backend нужны такие значения:

```text
DB_URL=jdbc:postgresql://<neon-host>:5432/<database>?sslmode=require
DB_USERNAME=<neon-user>
DB_PASSWORD=<neon-password>
```

Важно: Neon часто показывает строку вида `postgresql://user:password@host/db?sslmode=require`. Для Spring Boot здесь используем JDBC-формат: `jdbc:postgresql://host:5432/db?sslmode=require`.

## 3. Render Backend

1. В Render откройте `Blueprints` или `New +` -> `Blueprint`.
2. Подключите GitHub repo `e1dos-kubatov/crs-internship-project`.
3. Render увидит файл `render.yaml`.
4. При создании Render попросит значения для переменных с `sync: false`.
5. Заполните:

```text
DB_URL=jdbc:postgresql://<neon-host>:5432/<database>?sslmode=require
DB_USERNAME=<neon-user>
DB_PASSWORD=<neon-password>
FRONTEND_URL=https://<your-netlify-site>.netlify.app
APP_ADMIN_NAME=<admin-name>
APP_ADMIN_EMAIL=<admin-email>
APP_ADMIN_PASSWORD=<strong-admin-password>
```

`JWT_SECRET` Render сгенерирует сам через `generateValue: true`.

После успешного деплоя backend должен быть доступен здесь:

```text
https://crs-internship-project-1.onrender.com
```

Если Render выдаст другой subdomain, используйте реальный URL сервиса и обновите три места: `BACKEND_URL` в Render, `VITE_API_URL` в Netlify и Google OAuth redirect URI.

Проверка backend:

```text
https://crs-internship-project-1.onrender.com/api/auth/oauth2/status
```

## 4. Netlify Frontend

1. В Netlify выберите `Add new project` -> `Import an existing project`.
2. Подключите GitHub repo `e1dos-kubatov/crs-internship-project`.
3. Netlify прочитает `netlify.toml`.
4. Проверьте build settings:

```text
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

5. Проверьте env:

```text
VITE_API_URL=https://crs-internship-project-1.onrender.com/api
NODE_VERSION=22
```

После деплоя frontend будет доступен на Netlify URL. Этот URL нужно вернуться и поставить в Render как `FRONTEND_URL`, затем redeploy backend.

## 5. Google OAuth

Без Google OAuth обычный login/register работает.

Если нужен вход через Google:

1. В Google Cloud Console откройте OAuth Client.
2. Добавьте Authorized redirect URI:

```text
https://crs-internship-project-1.onrender.com/login/oauth2/code/google
```

3. В Render замените:

```text
GOOGLE_CLIENT_ID=<real-google-client-id>
GOOGLE_CLIENT_SECRET=<real-google-client-secret>
```

4. Redeploy backend.

## 6. Важная безопасность

В последнем коммите в `application.properties` был реальный admin password как default. Его нужно считать скомпрометированным: смените этот пароль везде, где он использовался, и для production задайте новый сильный `APP_ADMIN_PASSWORD` только через Render env.
