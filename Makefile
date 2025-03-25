# Makefile

up:
	docker-compose up --build

down:
	docker-compose down

backend-shell:
	docker exec -it $$(docker ps -qf "ancestor=backend") sh

frontend-shell:
	docker exec -it $$(docker ps -qf "ancestor=frontend") sh

logs:
	docker-compose logs -f

rebuild:
	docker-compose down --volumes --remove-orphans && docker-compose up --build
