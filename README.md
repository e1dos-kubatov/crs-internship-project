# Car Rental Full-Stack Web App

This repository contains a complete car-rental platform with a Spring Boot backend and a React frontend in one project.

The backend provides authentication, JWT security, OAuth2 login, role-based access, car management, partner car submissions, rental booking, and admin moderation. The frontend consumes those APIs and provides the public fleet, authentication pages, partner account area, and admin dashboard.

## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring Security, JWT, OAuth2 Client, Spring Data JPA
- Frontend: React, Vite, Axios, React Router, Tailwind CSS, lucide-react
- Database: PostgreSQL
- Build tools: Maven and npm

## Project Structure

```text
crs-internship-project/
+-- car-rental-backend/      Spring Boot API application
+-- frontend/                React/Vite web application
+-- run-dev.ps1              One-command local development launcher
+-- README.md                Project documentation
```

## Local Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- Backend API base URL: `http://localhost:8081/api`

The React app calls `http://localhost:8081/api` by default. You can override this with `VITE_API_URL`.

## Prerequisites

Install these before running the project:

- Java 17
- Maven
- Node.js and npm
- PostgreSQL

Create the PostgreSQL database:

```sql
CREATE DATABASE "car-rental-system";
```

Default backend database settings are in `car-rental-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/car-rental-system
spring.datasource.username=postgres
spring.datasource.password=1234567
```

You can override them with environment variables:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/car-rental-system"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="1234567"
```

## Run The Full Web App

From the repository root, run:

```powershell
cd C:\Users\Admin\crs-internship-project
.\run-dev.ps1
```

This command opens two PowerShell windows:

- One window starts the Spring Boot backend with `mvn spring-boot:run`.
- One window starts the React frontend with `npm run dev`.
- If `frontend/node_modules` does not exist, the script runs `npm install` first.

Keep both PowerShell windows open while using the application.

Open the web app in your browser:

```text
http://localhost:5173
```

If you already have old backend/frontend windows running and want to restart them cleanly, run:

```powershell
cd C:\Users\Admin\crs-internship-project
.\run-dev.ps1 -Restart
```

The restart option stops the processes currently listening on ports `8081` and `5173`, then starts fresh backend and frontend windows.

## Run Services Manually

Backend:

```powershell
cd C:\Users\Admin\crs-internship-project\car-rental-backend
mvn spring-boot:run
```

Frontend:

```powershell
cd C:\Users\Admin\crs-internship-project\frontend
npm install
npm run dev
```

If your backend API URL is different:

```powershell
cd C:\Users\Admin\crs-internship-project\frontend
$env:VITE_API_URL="http://localhost:8081/api"
npm run dev
```

## Default Admin Account

The backend seeds an admin user automatically when it starts:

```text
Email: admin@carrental.com
Password: Admin123!
```

You can override these values:

```powershell
$env:APP_ADMIN_NAME="System Admin"
$env:APP_ADMIN_EMAIL="admin@carrental.com"
$env:APP_ADMIN_PASSWORD="Admin123!"
```

## Roles And Access

The project uses `PARTNER` as the default non-admin role.

- `ROLE_PARTNER`: can register, log in, browse cars, create rentals, view own rentals, submit cars, and manage own cars.
- `ROLE_ADMIN`: can manage all cars, approve or reject submitted cars, view all rentals, update rental statuses, and view users.
- `ROLE_SUPERADMIN`: reserved for extended admin and audit capabilities.

The old `CUSTOMER` role is removed from the active role model. Existing database rows with `ROLE_CUSTOMER` are migrated to `ROLE_PARTNER` by the backend startup seeder.

## Main Features

- JWT login and protected API calls
- OAuth2 login support for Google
- Public approved-car browsing
- Search and filtering by price, type, transmission, fuel, and text
- Rental creation through `/api/rentals`
- Partner dashboard with own rentals and car submissions
- Admin dashboard with users, all rentals, and car approval or rejection
- Modern React UI with responsive layouts and updated color system

## Useful Backend Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/cars`
- `POST /api/cars`
- `GET /api/cars/my`
- `GET /api/cars/admin/all`
- `PATCH /api/cars/{id}/decision`
- `POST /api/rentals`
- `GET /api/rentals/my-rentals`
- `GET /api/rentals/history`
- `PATCH /api/rentals/{id}/status`
- `GET /api/admin/users`

## Build And Verification

Backend:

```powershell
cd C:\Users\Admin\crs-internship-project\car-rental-backend
mvn test
```

Frontend:

```powershell
cd C:\Users\Admin\crs-internship-project\frontend
npm run lint
npm run build
```

## Troubleshooting

If the frontend cannot log in or load cars, confirm the backend is running at:

```text
http://localhost:8081
```

If the backend fails to start, confirm PostgreSQL is running and the database `car-rental-system` exists.

If the backend says `Port 8081 was already in use`, another backend is already running. Close the old backend PowerShell window or run:

```powershell
cd C:\Users\Admin\crs-internship-project
.\run-dev.ps1 -Restart
```

If the frontend port is busy, Vite may choose another port. Use the URL printed in the frontend PowerShell window.

If OAuth2 login is not needed, local email/password login works without Google credentials. To use Google OAuth2, configure:

```powershell
$env:GOOGLE_CLIENT_ID="your-client-id"
$env:GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Notes

The backend no longer serves its own static `index.html`. The React frontend is the web interface, and Spring Boot is used as the API server.
