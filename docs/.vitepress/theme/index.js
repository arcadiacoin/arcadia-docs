// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './Layout.vue'
import './theme.css'

import CodeGroup from './components/global/CodeGroup.ts'
import CodeGroupItem from './components/global/CodeGroupItem.vue'
import TableOfContents from './components/global/toc.vue'

export default {
  ...DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('CodeGroup', CodeGroup)
    app.component('CodeGroupItem', CodeGroupItem)
    app.component('TableOfContents', TableOfContents)
  }
}
