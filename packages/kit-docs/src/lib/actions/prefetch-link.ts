export function prefetchLink(node: HTMLAnchorElement) {
  function update() {
    const href = node.getAttribute('href');
    if (/https?:/.test(href)) {
      node.removeAttribute('data-sveltekit-prefetch');
    } else {
      node.setAttribute('data-sveltekit-prefetch', '');
    }
  }

  update();
  return {
    update,
  };
}
