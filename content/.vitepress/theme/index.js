import DefaultTheme from 'vitepress/theme';
import NostrPHPLayout from './NostrPHPLayout.vue'
import matomo from "@datagouv/vitepress-plugin-matomo";
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: NostrPHPLayout,
  enhanceApp: (ctx) => {
    matomo({
      router: ctx.router,
      siteID: 15, // Replace with your site id
      trackerUrl: "https://matomo.sebastix.nl" // Replace with your matomo url
    })
  }
}
