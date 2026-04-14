# 🚗 Car Rental System - Fullstack Production-Ready

## Tech Stack
- **Backend:** Spring Boot 3 + Java 17 + PostgreSQL + JWT/OAuth2 + RBAC
- **Frontend:** React 18 + Vite + Tailwind CSS + Axios
- **DevOps:** Docker Compose

## Quick Start
```bash
# Copy env
cp .env.example .env
# Edit .env (DB/JWT/OAuth creds)

# Docker (recommended)
docker compose up --build

# Or manual
docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=car-rental-system postgres:14
cd backend && mvn spring-boot:run
cd ../frontend && npm install && npm run dev
```

**Ports:**
- Backend API: http://localhost:8081
- Frontend: http://localhost:5173
- Postgres: 5432

## Features
- JWT + OAuth2 (Google/FB) auth
- Advanced RBAC (permissions-based)
- Audit logs + soft delete
- Full CRUD cars/rentals/orders
- Admin dashboard (users/logs)
- Responsive SaaS UI

## API Docs
`/swagger-ui.html` (add springdoc later)

## Roles & Permissions
- ROLE_CUSTOMER: BOOK_CAR, CANCEL_ORDER
- ROLE_PARTNER: CREATE_CAR, UPDATE_CAR (own)
- ROLE_SUPPORT: VIEW_USERS, VIEW_FINANCES
- ROLE_ADMIN: MANAGE_USERS (ban), VIEW_LOGS
- ROLE_SUPERADMIN: All + DELETE_ANY

## Env Vars (.env)
```
DB_URL=jdbc:postgresql://localhost:5432/car-rental-system
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your-64-char-secret
# OAuth: GOOGLE_CLIENT_ID etc.
```

Enjoy! 🚀

