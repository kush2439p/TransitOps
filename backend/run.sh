#!/bin/bash
# Wrapper: load /app/backend/.env, then exec Spring Boot jar
set -e
cd /app/backend
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi
exec /usr/bin/java -Xms128m -Xmx512m -jar /app/backend/target/transitops-backend.jar
