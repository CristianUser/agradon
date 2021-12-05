start:
	make start-services && make start-server

start-server:
	npm run start:dev

start-services:
	docker compose up -d db

stop-services:
	docker compose stop db

remove-containers:
	@echo "Removing all stopped containers..."
	docker-compose rm db

burn:
	@echo "Stopping and removing all containers..."
	make stop-services && make remove-containers

default: start
