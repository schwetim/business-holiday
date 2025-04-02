# Makefile

# Development commands (use docker-compose.dev.yml)
updev:
	docker compose -f docker-compose.dev.yml up --build

downdev:
	docker compose -f docker-compose.dev.yml down

rebuilddev:
	docker compose -f docker-compose.dev.yml down --volumes --remove-orphans && docker compose -f docker-compose.dev.yml up --build --force-recreate

# Production-style commands (use docker-compose.yml)
up:
	docker compose up --build

down:
	docker compose down

rebuild:
	docker compose down --volumes --remove-orphans && docker compose up --build

# Utility commands
backend-shell:
	docker exec -it $$(docker ps -qf "ancestor=business-holiday-booking-backend") sh

frontend-shell:
	docker exec -it $$(docker ps -qf "ancestor=business-holiday-booking-frontend") sh

logs:
	docker compose logs -f

rebuild-backend:
	docker compose down && docker compose build backend && docker compose up -d

rebuild-frontend:
	docker compose build frontend && docker compose up -d
