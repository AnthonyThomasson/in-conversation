default:
	docker compose up

prod:
	docker compose -f docker-compose.prod.yml up --build