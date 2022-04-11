export function prefetchLink(node: HTMLAnchorElement) {
  function update() {
    const href = node.getAttribute('href');
    if (/https?:/.test(href)) {
      node.removeAttribute('sveltekit:prefetch');
    } else {
      node.setAttribute('sveltekit:prefetch', '');
    }
  }

  update();
  return {
    update,
  };
}
