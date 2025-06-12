# Website for https://nostr-php.dev

This documentation website is created with [VitePress](https://vitepress.dev/).

Guide how to use Markdown with Vitepress: https://vitepress.dev/guide/markdown

## Install packages

```bash
npm install
```
All code dependecies are saved in `node_modules`.
## Build

```bash
npm run docs:build
```

All files are generated and saved in `content/.vitepress/dist/`.

## Deployment

You can use [nsite-cli](https://www.npmjs.com/package/nsite-cli) to deploy the assets as a static website on Blossom servers.

The published site coupled to the [Nostr-PHP](https://njump.me/npub1phpdev2d38u5hzs4jrsh360mevh0rjctu9669quy97wu23u8sqdqpfha0j) profile:
* https://npub1phpdev2d38u5hzs4jrsh360mevh0rjctu9669quy97wu23u8sqdqpfha0j.nsite.lol
* https://npub1phpdev2d38u5hzs4jrsh360mevh0rjctu9669quy97wu23u8sqdqpfha0j.nostrdeploy.com

Check `.gitlab-ci.yml` for deployment to https://nostr-php.dev.

```bash
npx nsite-cli upload content/.vitepress/dist
```

## Development

```bash
npm run docs:dev
```
Open the website locally in your browser with this URL: http://localhost:5173.

### Edit navigation

All navigation items in the header are configured in `.vitepress/config.mjs`.

### Edit sidebar

All items in the sidebar are configured in `.vitepress/config.mjs`.

### Custom styling

Custom CSS styling is applied by `.vitepress/theme/custom.css`.