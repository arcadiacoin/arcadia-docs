// Based on vitepress default theme useSidebar
import { DefaultTheme } from 'vitepress/theme'
import { isArray, ensureStartingSlash, removeExtention } from '../utils'

export function isTOCConfig(
  toc: DefaultTheme.SideBarConfig | DefaultTheme.MultiSideBarConfig
): toc is DefaultTheme.SideBarConfig {
  return toc === false || toc === 'auto' || isArray(toc)
}

export function isTOCGroup(
  item: DefaultTheme.SideBarItem
): item is DefaultTheme.SideBarGroup {
  return (item as DefaultTheme.SideBarGroup).children !== undefined
}

export function isTOCEmpty(toc?: DefaultTheme.SideBarConfig): boolean {
  return isArray(toc) ? toc.length === 0 : !toc
}

/**
 * Get the `SideBarConfig` from toc option. This method will ensure to get
 * correct toc config from `MultiSideBarConfig` with various path
 * combinations such as matching `guide/` and `/guide/`. If no matching config
 * was found, it will return `auto` as a fallback.
 */
export function getTOCConfig(
  toc: DefaultTheme.SideBarConfig | DefaultTheme.MultiSideBarConfig,
  path: string
): DefaultTheme.SideBarConfig {
  if (isTOCConfig(toc)) {
    return toc
  }

  path = ensureStartingSlash(path)

  for (const dir in toc) {
    // make sure the multi sidebar key starts with slash too
    if (path.startsWith(ensureStartingSlash(dir))) {
      return toc[dir]
    }
  }

  return 'auto'
}

/**
 * Get flat toc links from the toc items. This method is useful for
 * creating the "next and prev link" feature. It will ignore any items that
 * don't have `link` property and removes `.md` or `.html` extension if a
 * link contains it.
 */
export function getFlatTOCLinks(
  toc: DefaultTheme.SideBarItem[]
): DefaultTheme.SideBarLink[] {
  return toc.reduce<DefaultTheme.SideBarLink[]>((links, item) => {
    if (item.link) {
      links.push({ text: item.text, link: removeExtention(item.link) })
    }

    if (isTOCGroup(item)) {
      links = [...links, ...getFlatTOCLinks(item.children)]
    }

    return links
  }, [])
}
