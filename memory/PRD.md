# TransitOps — PRD

## Original Problem Statement
Build the **frontend** for TransitOps (Smart Transport Operations) and the **Spring Boot Auth backend** as the first backend module. React on the frontend, Spring Boot 3.3 + Spring Security 6 + JPA + MySQL + JWT (jjwt) on the backend. Secrets via env vars.

## Architecture
- **Repo layout:** `/app/backend` (Spring Boot) · `/app/frontend` (React)
- **Backend service:** Spring Boot 3.3 · Java 17 · JJWT 0.12 · MariaDB 10.11 (MySQL 8 dialect) · listens on `0.0.0.0:8001` (ingress `/api/*` → 8001)
- **Env loading:** `me.paulschwarz:spring-dotenv` auto-loads `/app/backend/.env` (see `.env.example`)
- **Frontend:** React on port 3000, calls `${REACT_APP_BACKEND_URL}/api/*`, stores JWT in `localStorage['transitops.jwt']`
- **Session restore:** on cold load, if JWT present but cached user missing, `/api/auth/me` is called before rendering protected routes (loading screen while it resolves)

## Endpoints (Auth module — v1)
| Method | Path                | Auth | Notes |
|--------|---------------------|------|-------|
| POST   | `/api/auth/signup`  | none | `{name,email,password,role}`; BCrypt hash; email unique; pw ≥ 8 |
| POST   | `/api/auth/login`   | none | `{email,password}` → `{token,tokenType,expiresIn,user}` |
| GET    | `/api/auth/me`      | JWT  | `Authorization: Bearer <token>` |
| GET    | `/api/health`       | none | liveness |

Roles: `ADMIN`, `FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`.

## Security
- Stateless (no server sessions)
- BCrypt password hashing; password field never returned
- HS512 JWT (24h), signed with `JWT_SECRET` env var
- Global `@RestControllerAdvice` returns JSON errors (never stack traces)
- CORS: permissive origin pattern (edge already applies WAF)

## Frontend Landing + Console (from earlier iterations)
- Cinematic dark landing page at `/` (parallax hero, features, roles, workflow, CTA)
- Login/Signup wired to real backend
- 8 console screens (Dashboard, Vehicles, Drivers, Trips, Maintenance, Fuel & Expenses, Reports) — ops data still mock/localStorage; only auth is real backend

## Backlog / P1 (next backend modules)
- Vehicle CRUD (RBAC: FLEET_MANAGER + ADMIN)
- Driver management (FLEET_MANAGER + SAFETY_OFFICER)
- Trip pipeline (DRIVER + FLEET_MANAGER)
- Maintenance, Fuel/Expense modules
- `@PreAuthorize`-driven per-endpoint role gating
- Wire ops data (vehicles/drivers/trips) from React store to REST endpoints
- Admin seed script for initial ADMIN user
- Refresh-token flow

## Test Credentials
See `/app/memory/test_credentials.md` (all 4 demo accounts, password `demo1234`).

## Files
- Backend: `/app/backend/{pom.xml, .env, .env.example, .gitignore, SETUP.md, run.sh, src/main/java/com/transitops/{TransitOpsApplication,config/SecurityConfig,controller/{AuthController,HealthController},dto/*,entity/{User,Role,UserStatus},repository/UserRepository,security/{JwtUtil,JwtAuthFilter,UserDetailsServiceImpl},service/AuthService,exception/*}.java, src/main/resources/application.properties}`
- Frontend: `/app/frontend/src/lib/{api.js,store.js,rbac.js,mockData.js}` and pages
