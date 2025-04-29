# Website for https://nostr-php.dev

This documentation website is created with [VitePress](https://vitepress.dev/).
Guido how to use Markdown with Vitepress: https://vitepress.dev/guide/markdown

## Install packages

```bash
npm install
```
All code dependecies are saved in `node_modules`.
## Build

```bash
npm run docs:build
```

All files are generated and saved in `content/.vitepress/dist/`

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