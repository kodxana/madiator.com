# madiator.com - https://madiator.com

This repo contains the UI code that powers the official LBRY desktop app, as well as madiator.com (fork of LBRY.tv). The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.com) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with a UI using
[Electron](https://electron.atom.io/).

 <a href="https://github.com/lbryio/lbry-desktop/blob/master/LICENSE" title="MIT licensed">
   <img alt="npm" src="https://img.shields.io/dub/l/vibe-d.svg?style=flat">
 </a>

![App GIF](https://spee.ch/ba/lbry-joule.gif)

## Running from Source

You can run the web version (madiator.com), the electron app, or both at the same time.

#### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (v10 required)
- [Yarn](https://yarnpkg.com/en/docs/install)

1. Clone (or [fork](https://help.github.com/articles/fork-a-repo/)) this repository: `git clone https://gitlab.com/romanrex19/madiator.com`
2. Change directory into the cloned repository: `cd madiator.com`
3. Install the dependencies: `yarn`

#### Run the electron app

`yarn dev`

- If you want to build and launch the production app you can run `yarn build`. This will give you an executable inside the `/dist` folder. We use [electron-builder](https://github.com/electron-userland/electron-builder) to create distributable packages.

#### Run the web app for development

`yarn dev:web`

- This uses webpack-dev-server and includes hot-reloading. If you want to debug the [web server we use in production](https://gitlab.com/romanrex19/madiator.com/blob/master/src/platforms/web/server.js) you can run `yarn dev:web-server`. This starts a server at `localhost:1337` and does not include hot reloading.

#### Customize the web app

- In root directory, duplicate the .env.default file and rename it to .env then copy the code below and paste it anywhere in the .env file.

```
cp .env.defaults .env
nano .env
```

- To specify your own OG-IMAGE
  You can either place a png named v2-og.png in the /custom folder or specify the OG_IMAGE_URL in .env

- If you want to customize the homepage content

1. add `CUSTOM_HOMEPAGE=true` to the '.env' file
2. copy `/custom/homepage.example.js` to `/custom/homepage.js` and make desired changes to `homepage.js`

- If you want up to two custom sidebar links

```
PINNED_URI_1=@someurl#2/someclaim#4
PINNED_LABEL_1=Linktext

PINNED_URI_2=$/discover?t=tag&[queryparams]
PINNED_LABEL_2=OtherLinkText
```

- Finally `NODE_ENV=production yarn compile:web` to rebuild
  _Note: You don't need to edit the .env file in the /web folder - that is copied during compile._

#### Deploy the web app (_experimental_)

1. Create a server with a domain name and a reverse proxy https to port 1337.
2. Install pm2, node v10, yarn
3. Clone this repo
4. Make any customizations as above
5. Run `yarn` to install
6. Run `NODE_ENV=production yarn compile:web` to build
7. Set up pm2 to start ./web/index.js

#### Run both at the same time

Run the two commands above in separate terminal windows

```
yarn dev

// in another terminal window
yarn dev:web
```

#### Resetting your Packages

If the app isn't building, or `yarn xxx` commands aren't working you may need to just reset your `node_modules`. To do so you can run: `rm -r node_modules && yarn` or `del /s /q node_modules && yarn` on Windows.

If you _really_ think something might have gone wrong, you can force your repo to clear everything that doesn't match the repo with `git reset --hard HEAD && git clean -fxd && git pull -r`

## License

This project is MIT licensed. For the full license, see [LICENSE](LICENSE).

