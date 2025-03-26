# Makefile

up:
	docker compose up --build

down:
	docker compose down

backend-shell:
	docker exec -it $$(docker ps -qf "ancestor=business-holiday-booking-backend") sh

frontend-shell:
	docker exec -it $$(docker ps -qf "ancestor=business-holiday-booking-frontend") sh

logs:
	docker compose logs -f

rebuild:
	docker compose down --volumes --remove-orphans && docker compose up --build

rebuild-backend:
	docker compose down && docker compose build backend && docker compose up -d

rebuild-frontend:
	docker compose build frontend && docker compose up -d