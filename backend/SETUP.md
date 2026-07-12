# TransitOps — Backend Setup

Spring Boot 3.3 · Java 17 · MySQL 8 · JWT auth (jjwt)

## 1. Prerequisites
- JDK 17+
- Maven 3.9+
- MySQL 8.x running locally

## 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in **your own** values:
```
DB_URL=jdbc:mysql://localhost:3306/transitops?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=transitops
DB_PASSWORD=<your_password>
JWT_SECRET=<long random string, 64+ chars>
JWT_EXPIRATION=86400000
SERVER_PORT=8001
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```
**Never commit `.env`** — it's in `.gitignore`.

## 3. Create the MySQL database
```sql
CREATE DATABASE transitops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'transitops'@'localhost' IDENTIFIED BY '<your_password>';
GRANT ALL PRIVILEGES ON transitops.* TO 'transitops'@'localhost';
FLUSH PRIVILEGES;
```

## 4. Run
```bash
mvn spring-boot:run
```
Or build a jar:
```bash
mvn -q -DskipTests clean package
java -jar target/transitops-backend.jar
```

## 5. Endpoints
All prefixed `/api`.

| Method | Path                | Auth | Notes |
|--------|---------------------|------|-------|
| POST   | `/api/auth/signup`  | none | Body `{name,email,password,role}` |
| POST   | `/api/auth/login`   | none | Body `{email,password}` returns `{token,user}` |
| GET    | `/api/auth/me`      | JWT  | Header `Authorization: Bearer <token>` |
| GET    | `/api/health`       | none | Liveness probe |

Roles: `FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`, `ADMIN`.

## 6. Notes
- Passwords are BCrypt hashed. The `password` field is never returned in any response DTO.
- Sessions are stateless (JWT only).
- Global exception handler returns JSON `{ "status", "error", "message", "timestamp" }` for 400/401/403/404/500.
