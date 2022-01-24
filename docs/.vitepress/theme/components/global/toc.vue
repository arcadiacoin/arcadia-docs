<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import { DefaultTheme } from 'vitepress/theme'
import { getTOCConfig } from '../../support/toc'
import { ContentLink } from '../ContentLink'

const items = useTableOfContents()

function useTableOfContents() {
  const route = useRoute()
  const { site } = useData()

  return computed(() => {
    // at first, we'll check if we can find the sidebar setting in frontmatter.
    const headers = route.data.headers
    const frontTOC = route.data.frontmatter.toc
    const tocDepth = route.data.frontmatter.tocDepth

    // if it's `false`, we'll just return an empty array here.
    if (frontTOC === false) {
      return []
    }

    // if it's `auto`, render headers of the current page
    if (frontTOC === 'auto') {
      return resolveAutoTOC(headers, tocDepth)
    }

    // now, there's no sidebar setting at frontmatter; let's see the configs
    const themeTOC = getTOCConfig(
      site.value.themeConfig.toc,
      route.data.relativePath
    )

    if (themeTOC === false) {
      return []
    }

    if (themeTOC === 'auto') {
      return resolveAutoTOC(headers, tocDepth)
    }

    return themeTOC
  })
}

function resolveAutoTOC(
  headers: DefaultTheme.Header[],
  depth: number
): DefaultTheme.SideBarItem[] {
  const ret: DefaultTheme.SideBarItem[] = []

  if (headers === undefined) {
    return []
  }

  let lastH2: DefaultTheme.SideBarItem | undefined = undefined
  headers.forEach(({ level, title, slug }) => {
    if (level - 1 > depth) {
      return
    }

    const item: DefaultTheme.SideBarItem = {
      text: title,
      link: `#${slug}`
    }
    if (level === 2) {
      lastH2 = item
      ret.push(item)
    } else if (lastH2) {
      ;((lastH2 as any).children || ((lastH2 as any).children = [])).push(item)
    }
  })

  return ret
}
</script>

<template>
  <div class="toc pt-8 hidden xl:block">
    <div class="text-sm">
      <span class="block font-bold mb-4">
        Table of Contents
      </span>

      <ul v-if="items.length > 0" class="sidebar-links">
        <ContentLink v-for="item of items" :item="item" />
      </ul>
    </div>
  </div>
</template>

<style>
.toc {
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  right: 0;
  z-index: var(--z-index-sidebar);
  border-right: 1px solid var(--c-divider);
  width: 16.4rem;
  background-color: var(--c-bg);
  overflow-y: auto;
}
</style>
