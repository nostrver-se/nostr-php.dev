import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nostr-PHP",
  description: "A PHP helper library for Nostr",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/nostr-php_hero-splash.png',
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
        text: 'What is Nostr-PHP?',
      },
      {
        text: 'CLI client',
      },
      {
        text: 'Guides',
        items: [
          { text: 'Get started', link: '/guides/get-started' },
          { text: 'Generate keys', link: '/guides/generate-keys' },
          { text: 'Event kinds' },
          { text: 'Publish an event', link: '/guides/publish-event' },
          { text: 'Read events', link: '/guides/read-events' },
          { text: 'Sign event', link: '/guides/sign-event' },
          { text: 'Verify event', link: '/guides/verify-event' },
          { text: 'Manage tags on events' },
          { text: 'Manage content on events' },
          { text: 'Relays' },
          { text: 'Relay messages' },
          { text: 'Relay responses', link: '/guides/relay-responses' }
        ]
      },
      {
        text: 'Examples', link: '/examples/index'
      },
      {
        text: 'References', link: '/references/index'
      },
      {
        text: 'Contribute'
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
