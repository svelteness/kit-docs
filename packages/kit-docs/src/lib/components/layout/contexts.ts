import { getContext, setContext, SvelteComponent } from 'svelte';
import { derived, type Readable, readable } from 'svelte/store';

import { page } from '$app/stores';
import { kebabToTitleCase, titleToKebabCase } from '$lib/utils/string.js';
import { isRegExp, isString } from '$lib/utils/unit.js';

export const NAVIGATION_CONTEXT_KEY = Symbol('');

export type NavigationConfig = {
  canUpdateHash: (hash: string) => boolean;
  cleanHash: (hash: string) => string;
};

export type NavigationContext = Readable<NavigationConfig>;

export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  canUpdateHash: () => true,
  cleanHash: (hash) => hash,
};

export function getNavigationContext(): NavigationContext {
  try {
    return getContext(NAVIGATION_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get navigation context before setting it.');
  }
}

export function setNavigationContext(context: NavigationContext) {
  setContext(NAVIGATION_CONTEXT_KEY, context);
}

export const NAVBAR_CONTEXT_KEY = Symbol('');

export type NavLinkItem = {
  title: string;
  slug: string;
  match?: RegExp | null;
};

export type NavbarConfig = {
  links: NavLinkItem[];
};

export type NavbarContext = Readable<NavbarConfig>;

export function getNavbarContext(): NavbarContext {
  try {
    return getContext(NAVBAR_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get navbar context before setting it.');
  }
}

export function createNavbarContext(config: Readable<NavbarConfig>): NavbarContext {
  return config;
}

export function setNavbarContext(context: NavbarContext) {
  setContext(NAVBAR_CONTEXT_KEY, context);
}

export type SidebarLink = {
  title: string;
  slug: string;
  match?: 'deep' | RegExp;
  icon?: { before?: typeof SvelteComponent; after?: typeof SvelteComponent };
};

export type SidebarLinks = {
  [category: string]: SidebarLink[];
};

export type SidebarSimpleLinks = {
  [category: string]: string[];
};

export type SidebarConfig = {
  baseUrl?: string;
  links: SidebarLinks | SidebarSimpleLinks;
};

export type ResolvedSidebarConfig = {
  baseUrl?: string;
  links: SidebarLinks;
};

export function normalizeSidebarConfig(config?: SidebarConfig): ResolvedSidebarConfig {
  if (!config) return { links: {} };

  const links: SidebarLinks = {};

  const baseUrl = config.baseUrl?.replace(/\/$/, '') ?? '';

  for (const category of Object.keys(config.links)) {
    const categoryLinks = config.links[category];
    const categorySlug = titleToKebabCase(category);

    const categoryName = isString(config.links[category][0])
      ? kebabToTitleCase(category)
      : category;

    for (const categoryLink of categoryLinks) {
      const link: SidebarLink = isString(categoryLink)
        ? {
            title: kebabToTitleCase(categoryLink),
            slug: `${baseUrl}/${categorySlug}/${categoryLink}`,
          }
        : categoryLink;

      if (!links[categoryName]) links[categoryName] = [];

      links[categoryName].push(link);
    }
  }

  return {
    ...config,
    links,
  };
}

export function isActiveSidebarLink({ match, slug }: SidebarLink, currentPath: string) {
  const path = currentPath.replace(/\.html/, '');

  if (match === 'deep') {
    return path === slug || (path.startsWith(slug) && path[slug.length] === '/');
  }

  if (isRegExp(match)) {
    return match.test(slug);
  }

  return path === slug;
}

export const SIDEBAR_CONTEXT_KEY = Symbol();

export type SidebarContext = {
  config: Readable<ResolvedSidebarConfig>;
  allLinks: Readable<SidebarLink[]>;
  activeLinkIndex: Readable<number>;
  activeLink: Readable<SidebarLink | null>;
  previousLink: Readable<SidebarLink | null>;
  nextLink: Readable<SidebarLink | null>;
  activeCategory: Readable<string | null>;
};

export function createSidebarContext(
  config: SidebarConfig | null | Readable<SidebarConfig | null>,
): SidebarContext {
  const configStore =
    config && 'subscribe' in config ? config : readable(config as SidebarConfig | null);

  const normalizedConfig = derived(configStore, ($config) => normalizeSidebarConfig($config));

  const allLinks = derived(normalizedConfig, ($config) => Object.values($config.links).flat());

  const activeLinkIndex = derived([allLinks, page], ([$allLinks, $page]) =>
    $allLinks.findIndex((link) => isActiveSidebarLink(link, $page.url.pathname)),
  );

  const activeLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex],
  );

  const previousLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex - 1],
  );

  const nextLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex + 1],
  );

  const activeCategory = derived([normalizedConfig, activeLink], ([$config, $activeLink]) => {
    const category = Object.keys($config.links).find((category) =>
      $config.links[category]?.some(
        (link) => link.title === $activeLink?.title && link.slug === $activeLink?.slug,
      ),
    );

    return category !== '.' ? category : null;
  });

  const context: SidebarContext = {
    config: normalizedConfig,
    allLinks,
    activeLinkIndex,
    activeLink,
    previousLink,
    nextLink,
    activeCategory,
  };

  return context;
}

export function setSidebarContext(context: SidebarContext) {
  setContext(SIDEBAR_CONTEXT_KEY, context);
}

export function getSidebarContext(): SidebarContext {
  try {
    return getContext(SIDEBAR_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get sidebar context before setting it.');
  }
}

export type I18NTranslations = {
  nav: {
    next: string;
    previous: string;
    mainMenu: string;
    openSidebar: string;
    options: string;
    links: string;
  };
  toc: {
    title: string;
  };
  colorScheme: {
    title: string;
    light: string;
    dark: string;
    system: string;
    theme: string;
  };
  dialog: {
    close: string;
  };
  admonition: {
    note: string;
    info: string;
    tip: string;
    warning: string;
    danger: string;
    experimental: string;
  };
  code: {
    copy: string;
    copied: string;
  };
};

export const DEFAULT_I18N_TRANSLATIONS: I18NTranslations = {
  nav: {
    previous: 'Previous',
    next: 'Next',
    mainMenu: 'Main navigation menu',
    openSidebar: 'Open main sidebar',
    options: 'Options',
    links: 'Links',
  },
  toc: {
    title: 'On this page',
  },
  colorScheme: {
    title: 'Color Scheme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    theme: 'Theme',
  },
  dialog: {
    close: 'Close dialog',
  },
  admonition: {
    note: 'NOTE',
    info: 'INFO',
    tip: 'TIP',
    warning: 'WARNING',
    danger: 'DANGER',
    experimental: 'EXPERIMENTAL',
  },
  code: {
    copy: 'Copy code',
    copied: 'Copied!',
  },
};

export type I18NContext = Readable<I18NTranslations>;

export const I18N_CONTEXT_KEY = Symbol();

export function getI18nContext(): I18NContext {
  try {
    return getContext(I18N_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get i18n context before setting it.');
  }
}

export function setI18nContext(context: I18NContext) {
  setContext(I18N_CONTEXT_KEY, context);
}
