// Actions
export * from './actions/dialogManager';

// Components
export { default as Algolia } from './components/algolia/Algolia.svelte';
export { default as Button } from './components/base/Button.svelte';
export { default as Chip } from './components/base/Chip.svelte';
export { default as ColorSchemeMenu } from './components/base/ColorSchemeMenu.svelte';
export { default as Menu } from './components/base/Menu.svelte';
export { default as MenuItem } from './components/base/MenuItem.svelte';
export { default as Overlay } from './components/base/Overlay.svelte';
export { default as Popover } from './components/base/Popover.svelte';
export { default as Select } from './components/base/Select.svelte';

// Layout
export { default as DocsLayout } from './components/layout/DocsLayout.svelte';
export { default as Navbar } from './components/layout/Navbar.svelte';
// @ts-ignore - type not detected before build.
export { createSidebarContext, default as Sidebar } from './components/layout/Sidebar.svelte';

// Markdown (Block)
export { default as Blockquote } from './components/markdown/block/Blockquote.svelte';
export { default as CodeBlock } from './components/markdown/block/CodeBlock.svelte';
export { default as Heading1 } from './components/markdown/block/Heading1.svelte';
export { default as Heading2 } from './components/markdown/block/Heading2.svelte';
export { default as Heading3 } from './components/markdown/block/Heading3.svelte';
export { default as Heading4 } from './components/markdown/block/Heading4.svelte';
export { default as Heading5 } from './components/markdown/block/Heading5.svelte';
export { default as Heading6 } from './components/markdown/block/Heading6.svelte';
export { default as HorizontalRule } from './components/markdown/block/HorizontalRule.svelte';
export { default as ListItem } from './components/markdown/block/ListItem.svelte';
export { default as OrderedList } from './components/markdown/block/OrderedList.svelte';
export { default as Paragraph } from './components/markdown/block/Paragraph.svelte';
export { default as Table } from './components/markdown/block/Table.svelte';
export { default as TableWrapper } from './components/markdown/block/TableWrapper.svelte';
export { default as UnorderedList } from './components/markdown/block/UnorderedList.svelte';

// Markdown (Inline)
export { default as CodeInline } from './components/markdown/inline/CodeInline.svelte';
export { default as Emphasized } from './components/markdown/inline/Emphasized.svelte';
export { default as Image } from './components/markdown/inline/Image.svelte';
export { default as Link } from './components/markdown/inline/Link.svelte';
export { default as Strikethrough } from './components/markdown/inline/Strikethrough.svelte';
export { default as Strong } from './components/markdown/inline/Strong.svelte';

// Markdown (Custom)
export { default as Admonition } from './components/markdown/custom/Admonition.svelte';
export { default as No } from './components/markdown/custom/No.svelte';
export { default as Step } from './components/markdown/custom/Step.svelte';
export { default as Steps } from './components/markdown/custom/Steps.svelte';
export { default as TabbedLinks } from './components/markdown/custom/TabbedLinks.svelte';
export { default as TableOfContents } from './components/markdown/custom/TableOfContents.svelte';
export { default as Yes } from './components/markdown/custom/Yes.svelte';

// Stores
export * from './stores/colorScheme';
export * from './stores/isLargeScreen';
export * from './stores/markdown';

// Utils
export * from './utils/scroll';
