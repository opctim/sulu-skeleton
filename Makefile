deploy-prod:
	ANSIBLE_STDOUT_CALLBACK=debug ansible-playbook -v -i ansible/hosts -e 'version=${shell date +"%Y%m%d%H%M%S"}' -e 'build_frontend=${BUILD_FRONTEND}' ansible/deploy-prod.yml

init-db:
	docker-compose exec php bin/console doctrine:schema:update --force
	docker-compose exec php bin/adminconsole sulu:document:initialize
	- docker-compose exec php bin/console sulu:security:role:create User Sulu
	- docker-compose exec php bin/console sulu:security:user:create admin Adam Ministrator admin@example.com en User admin

composer-install:
	docker-compose exec php composer install

bash:
	docker-compose exec php bash

init-frontend:
	. ${HOME}/.nvm/nvm.sh && cd application && nvm install && npm install && npm run dev

install-nvm:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

setup:
	docker-compose up -d
	make composer-install
	make init-db
	make init-frontend
	echo "Done. You can login at https://yourhost.local/admin with user admin/admin"
