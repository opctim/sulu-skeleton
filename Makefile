SHELL := /bin/bash
include .env

default: help

.PHONY: help
help: # Show help for this make file
	@grep -E '(^[a-zA-Z0-9 -]+.*#|^#########+(.*))'  Makefile | while read -r l; do printf "\033[1;32m$$(echo $$l: | sed -e 's/#########.*//g' | cut -f 1 -d':')\033[00m -$$(echo $$l | cut -f 2- -d'#')\n"; done

up: # Builds and starts the containers
	docker-compose up -d --build

down: # Stops & removes the containers
	docker-compose down

logs: # Shows logs continuously
	docker-compose logs -f

restart: # Downs & starts the containers
	docker-compose down && docker-compose up -d

bash: # Opens a shell inside the php container
	docker-compose exec php bash

setup: # Initial project setup
	make up
	make composer-install
	make init
	@echo "Done. You can login at https://${NGINX_BACKEND_DOMAIN}/admin with user admin/admin"

init: # Initializes the database and builds the frontend
	make init-db
	make init-frontend

init-db: # Initializes the database and adds an admin user (User: admin Password: admin)
	docker-compose exec php bash -c "yes | bin/adminconsole sulu:build dev"
	docker-compose exec php bin/adminconsole sulu:document:initialize
	- docker-compose exec php bin/console sulu:security:role:create User Sulu || true
	- docker-compose exec php bin/console sulu:security:user:create admin Adam Ministrator admin@example.com en User admin || true

init-frontend: # Builds the frontend for development use.
	. ${HOME}/.nvm/nvm.sh && nvm install && npm install && npm run dev

composer-install: # Performs a composer install inside the php container
	docker-compose exec php composer install

install-nvm: # Installs NVM.sh
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

deploy: # Invokes the ansible playbook to deploy your application to a remote host
	ANSIBLE_STDOUT_CALLBACK=debug ansible-playbook -v -i ansible/hosts -e 'version=${shell date +"%Y%m%d%H%M%S"}' -e 'build_frontend=${BUILD_FRONTEND}' ansible/deploy-prod.yml
