# TransitOps

A unified transit operations management platform — vehicles, drivers, trips, maintenance, fuel and cost tracking — with role-based access control.

## Stack

- **Frontend**: React 19 (Create React App + craco), Tailwind CSS, Radix UI, React Router, TanStack Query
- **Backend**: Spring Boot 3.3 / Java 17, Spring Security, JPA/Hibernate, JWT auth (jjwt)
- **Database**: Replit managed PostgreSQL (swapped from MySQL; entities use standard JPA)

## Running the project

Two workflows run simultaneously:

| Workflow | Command | Port |
|---|---|---|
| `Start application` | `cd frontend && PORT=5000 yarn start` | 5000 (webview) |
| `Backend` | `cd backend && mvn spring-boot:run` | 8001 (console) |

The frontend proxies all `/api/*` requests to the backend on port 8001 (configured via `"proxy"` in `frontend/package.json`).

## Environment variables / secrets

| Key | Where | Notes |
|---|---|---|
| `JWT_SECRET` | Replit Secret | 64+ char random string for signing JWTs |
| `REACT_APP_BACKEND_URL` | Shared env var | Set to `""` (empty) — proxy handles routing |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Replit managed | Auto-provided, no manual setup needed |

## Roles

`FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`, `ADMIN`

## Auth endpoints

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/signup` | none |
| POST | `/api/auth/login` | none — returns `{token, user}` |
| GET | `/api/auth/me` | Bearer JWT |
| GET | `/api/health` | none |

## User preferences

- Keep the existing project structure (frontend/backend monorepo layout)
- Do not migrate to a different package manager or framework
