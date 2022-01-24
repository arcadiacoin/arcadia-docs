const MarkdownInclude = require('markdown-it-include')

export default {
  lang: 'en-US',
  title: 'PAW.digital Documentation',
  description: 'Learn how to contribute to the network or develop your own applications on top of PAW.',

  head: [
    [
      'script',
      {},
      ''
    ]
  ],

  themeConfig: {
    repo: 'paw-digital/paw-docs',
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
      text: 'Running a node',
      children: [
        { text: 'RPC Commands', link: '/node/rpc' },
      ]
    }
  ]
}
