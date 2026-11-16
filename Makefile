dev:
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build

deploy:
	git pull origin main
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build

logs:
	docker compose logs -f backend