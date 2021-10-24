all:
	${build}
	docker-compose up

.PHONY: build
build:
	docker-compose up -d --force-recreate

.PHONY: clean
clean:
	docker-compose down --rmi all
