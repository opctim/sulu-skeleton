SHELL := /bin/bash
include .env

default: help

deploy: # Invokes the ansible playbook to deploy your application to a remote host
	ANSIBLE_STDOUT_CALLBACK=debug ansible-playbook -v -i ansible/hosts -e 'version=${shell date +"%Y%m%d%H%M%S"}' -e 'build_frontend=${BUILD_FRONTEND}' ansible/deploy-prod.yml

init-db: # Initializes the database and adds an admin user (User: admin Password: admin)
	docker-compose exec php bin/console doctrine:schema:update --force
	docker-compose exec php bin/adminconsole sulu:document:initialize
	- docker-compose exec php bin/console sulu:security:role:create User Sulu
	- docker-compose exec php bin/console sulu:security:user:create admin Adam Ministrator admin@example.com en User admin

composer-install: # Performs a composer install inside the php container
	docker-compose exec php composer install

up: # Builds and starts the containers
	docker-compose up -d --build

bash: # Opens a shell inside the php container
	docker-compose exec php bash

init-frontend: # Builds the frontend for development use.
	. ${HOME}/.nvm/nvm.sh && cd application && nvm install && npm install && npm run dev

install-nvm: # Installs NVM.sh
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

setup: # Initial project setup
	make up
	make composer-install
	make init-db
	make init-frontend
	@echo "Done. You can login at https://$NGINX_BACKEND_DOMAIN/admin with user admin/admin"

.PHONY: help
help: # Show help for this make file
	@grep -E '(^[a-zA-Z0-9 -]+.*#|^#########+(.*))'  Makefile | while read -r l; do printf "\033[1;32m$$(echo $$l: | sed -e 's/#########.*//g' | cut -f 1 -d':')\033[00m$$(echo $$l | cut -f 2- -d'#')\n"; done
