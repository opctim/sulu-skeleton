Sulu Skeleton
==============

## Features

- PHP 8.2
- MariaDB 10.8.2
- Symfony 6.3
- Sulu 2.5
- Node 18
- Webpack Encore
- Typescript
- Bootstrap 5
- Bazinga Translator
- LuxonJS
- Axios
- Vanilla Cookieconsent
- Ansible Deploy Playbook

## Prerequisites

- Docker >= v20
- NVM.sh (If you don't have it, just run `make install-nvm` in your project root)
- Gas Mask

## Setup

1. In your project root, open the `.env` file and set all parameters to your liking.
2. Go to `application/config/webspaces/default.xml` and make a few changes:
   1. Rename the file to customize the webspace name. (e.g. mycompany.xml)
   2. Open the file and change `<name>` to some label and set `<key>` to the same value as the file name. (Marked with TODO)
   3. Scroll down and look for "portals". You'll see one domain for each environment. Set the local domain to the same as you set in your .env file before.
3. Run `make setup` to initialize the database, build the backend and the frontend.

## Ansible

This skeleton already contains an Ansible Playbook for deployment. You'll have to customize a few things to use it:

1. Under `ansible/hosts`, set your server name, ssh user and key path.
2. In `ansible/deploy-prod.yml` make the following changes (marked with TODO):
   1. Set the base_dir and sulu_storage according to your server setup (sulu_storage should match the path in your .env.prod).
   2. Set your user:group & your httpd / Apache / Nginx etc. user in the permissions section
   3. All the way at the bottom, you see the opcache reset tool. It is recommended to use it on deploy, as the Opcache can be quite stubborn to clear. If you'd like to use it, get it from here: https://github.com/gordalina/cachetool

## Coming back later

If your project is set up and you'd like to continue your work, simply run `make up` to start the containers.

## Frontend Workflow

The frontend lives in `application/assets/website`. Folder explanations:

- `fonts` Font files (woff / ttf / etc.)
- `images` SVGs / static images to be included by SCSS / Inline SVG
- `modules` If your Sulu module needs JS, it should go here. Styles that only concern this specific module belong here too.
- `scss` Styles go here.
  - `bootstrap` Configuration & Customization
  - `fonts` Font-Face style definitions for the font files mentioned above
  - `mixins` SCSS mixins
  - `partials` Repetitive SCSS goes here to be included elsewhere
  - `app.scss` Entry point. You should not put styles here.
  - `variables.scss` Contains SCSS variables to be globally available in all SCSS files
  - `inject.scss` As the name implies, this file is injected into every SCSS file while building to make SCSS variables and mixins publicly available. **WARNING** Do not put anything in here that produces CSS output (anything but mixins & variables). This will increase your frontend size significantly!
- `utils` Contains helper scripts / libraries / methods, e.g. **translate()**, which can be used to retrieve translations from the backend
- `app.ts` The entrypoint, you'll need to include your scripts / modules here to be loaded.

#### Build steps:

- `nvm install` This can be used as well as `nvm use`. The difference: It installs the version if missing. 
- `npm install`
- `npm run watch` or `npm run dev` (single-time dev build) or `npm run build` (prod build)


## Nice to know

`make bash` starts a bash inside the PHP container, for running symfony commands etc.

`make composer-install` runs composer install inside the PHP container.

The frontend comes with a svg-inline plugin. Use it to include SVGs into your stylesheets, as data urls:

```scss
@include svg-load(my-icon-black, 'website/images/icon-black.svg');

@include svg-load(my-icon-white, 'website/images/icon-black.svg') {
    path {
        fill: $color-white /* You can change colors on the fly! */ 
    }
};

.icon-black {
    background-image: svg-inline(my-icon-black);
}

.icon-white {
    background-image: svg-inline(my-icon-white);
}
```