import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nostr-PHP",
  description: "A PHP helper library for Nostr",
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  assetsDir: 'assets',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/nostr-php_hero-splash.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/get-started' },
      { text: 'Examples', link: '/examples' },
      { text: "References", link: '/references' },
      { text: 'phpDoc', link: 'https://phpdoc.nostr-php.dev' },
      { text: 'Fork me', link: 'https://github.com/nostrver-se/nostr-php.dev/fork' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction'
      },
      {
        text: 'CLI client',
        link: '/cli-client'
      },
      {
        text: 'Guides',
        items: [
          { text: 'Get started', link: '/guides/get-started' },
          { text: 'Generate keys', link: '/guides/generate-keys' },
          { text: 'Messages to relays', link: '/guides/messages-to-relays' },
          { text: 'Request events', link: '/guides/request-events' },
          { text: 'Filters and tags on request events', link: '/guides/filters-and-tags-on-request-events' },
          { text: 'Publish an event', link: '/guides/publish-event' },
          { text: 'Relay responses', link: '/guides/relay-responses' },
          { text: 'Verify event', link: '/guides/verify-event' },
          { text: 'Manage tags on events', link: '/guides/manage-tags-on-an-event' },
          { text: 'Asynchronous and concurrent requests', link: '/guides/asynchronous-and-concurrent-requests' }
        ]
      },
      {
        text: 'Examples', link: '/examples/index'
      },
      {
        text: 'References', link: '/references/index'
      },
      {
        text: 'Contribute', link: '/contribute'
      },
      {
        text: 'Chat', link: '/chat'
      },
      {
        text: 'Changelog', link: 'changelog'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nostrver-se/nostr-php' }
    ],

    editLink: {
      pattern: 'https://github.com/nostrver-se/nostr-php.dev/tree/main/website/content/:path'
    }
  },
  cleanUrls: true
})
