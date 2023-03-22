const MarkdownInclude = require('markdown-it-include')

export default {
  lang: 'en-US',
  title: 'Arcadia Documentation',
  description: 'Learn how to contribute to the network or develop your own applications on top of Arcadia.',

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
  }
}

function getNodeSidebar() {
  return [
    {
      text: 'Home',
      children: [
        { text: 'Install', link: '/' },
      ]
    },
    {
      text: 'Start',
      children: [
        { text: 'Beginner Examples', link: '/beginner/examples' },
      ]
    },
    {
      text: 'Running a node',
      children: [
        { text: 'Start', link: '/node/start' },
        { text: 'RPC Commands', link: '/node/rpc' },
        { text: 'MacOS Build', link: '/node/macos-build' },
      ]
    },
    {
      text: 'FAQ',
      children: [
        { text: 'Common Questions', link: '/faq/common' },
      ]
    }
  ]
}
