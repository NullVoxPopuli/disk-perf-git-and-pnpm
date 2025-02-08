#!/usr/bin/env bash

cd frameworks/

###############
#
# Lots of flags added to each of these commands
# in order to simulate (probably) real projects,
# and to be able to run this script non-interactively.
#
# Unfortunately, I'm not an expert in all these,
# and a good few still prompt
#
###############
set +xe

# Adonis 
# https://docs.adonisjs.com/guides/getting-started/installation
npm init adonisjs@latest adonis -- \
  --db=sqlite \
  --kit=api

# Angular
# https://angular.dev/installation
npx @angular/cli new angular \
  --create-application \
  --defaults \
  --routing \
  --package-manager pnpm \
  --strict \
  --style css \
  --skip-git \
  --skip-install

# Astro
# https://astro.build/
npm create astro@latest astro \
  --template blog \
  --no-install \
  --no-git \
  --yes

# Ember
# https://github.com/embroider-build/app-blueprint
npx ember-cli@latest new emberjs \
  --blueprint @embroider/app-blueprint@latest \
  --typescript \
  --pnpm \
  --skip-git

# NextJS
# https://nextjs.org/docs/app/getting-started/installation
npx create-next-app@latest nextjs \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --turbopack \
  --use-pnpm \
  --skip-install \
  --yes \
  --disable-git

# NuxtJS
# https://nuxt.com/
npx nuxi@latest init nuxtjs \
  --no-install \
  --packageManager pnpm

# Remix
# https://remix.run/docs/en/main/start/quickstart
npx create-remix@latest remix \
  --no-install \
  --no-git-init \
  --yes

# SailsJS
# https://sailsjs.com/get-started
npx sails new sailsjs -- \
  --fast

# SolidJS
# https://www.solidjs.com/guides/getting-started
npx degit solidjs/templates/ts solidjs

# Svelte
# https://svelte.dev/docs/svelte/getting-started
# No obvious way to not use SvelteKit

# SvelteKit
# https://svelte.dev/docs/kit/creating-a-project
npx sv create sveltekit \
  --template demo \
  --types ts \
  --no-install \
  --no-add-ons

# VuePress
# https://vuepress.vuejs.org/guide/getting-started.html#project-setup
pnpm create vuepress vuepress


# Vue
# https://vuejs.org/guide/quick-start
npm create vue@latest vue \
  --yes


# Vite-templates
# https://vite.dev/guide/
function vite() {
  npm create vite@latest -- --template $1 "vite-$1"
  npm create vite@latest -- --template "$1-ts" "vite-$1-ts"
}
vite vanilla
vite vue
vite react
vite react-swc
vite preact 
vite lit 
vite svelte 
vite solid 
vite qwik 


# Delete any .git directories, as
# Not all tools above have a way to opt out
find . -name '.git' -type d -prune -exec rm -rf '{}' +
# Same for node_modules, ugh
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
