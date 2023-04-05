const MarkdownInclude = require('markdown-it-include')
const { SearchPlugin } = require('vitepress-plugin-search')

export default {
  lang: 'en-US',
  title: 'Arcadia Developer Documentation',
  description: 'A documentation for Arcadia developers',
  appearance: 'dark',
  head: [
    [
      'script',
      {},
      ''
    ]
  ],

  themeConfig: {
    repo: 'arcadiacoin/arcadia-docs',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
	sidebarDepth: 2,
	outline: [2,4],
    nav: [],

    sidebar: {
      '/': getNodeSidebar(),
    }
  },

  markdown: {
    config(md) {
      md.use(MarkdownInclude, {
        root: './docs/snippets/',
        includeRe: /(?:-{2,}8<-{2,})([\s]+.+)/,
        bracesAreOptional: true
      })
    }
  },
  
  vite: {
    plugins: [SearchPlugin()],
  }
}

function getNodeSidebar() {
  return [
    {
      text: 'Home',
      items: [
        { text: 'Install', link: '/' },
      ]
    },
    {
      text: 'Start',
      items: [
        { text: 'Beginner Examples', link: '/beginner/examples' },
      ]
    },
    {
      text: 'Running a node',
      items: [
        { text: 'Start', link: '/node/start' },
        { text: 'RPC Commands', link: '/node/rpc' },
        { text: 'MacOS Build', link: '/node/macos-build' },
      ]
    },
    {
      text: 'FAQ',
      items: [
        { text: 'Common Questions', link: '/faq/common' },
      ]
    }
  ]
}
