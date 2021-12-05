start:
	make start-services && make start-server

start-server:
	npm run start:dev

start-services:
	docker compose up -d postgres mongo

stop-services:
	docker compose stop postgres mongo

remove-containers:
	@echo "Removing all stopped containers..."
	docker-compose rm postgres mongo

burn:
	@echo "Stopping and removing all containers..."
	make stop-services && make remove-containers

default: start
