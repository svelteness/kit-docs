# Style

CSS inside a `<style>` block will be scoped to that component.

This works by adding a class to affected elements, which is based on a hash of the component styles (e.g. `svelte-123xyz`).

```svelte
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

To apply styles to a selector globally, use the `:global(...)` modifier.

```svelte
<style>
	:global(body) {
		/* this will apply to <body> */
		margin: 0;
	}

	div :global(strong) {
		/* this will apply to all <strong> elements, in any
			 component, that are inside <div> elements belonging
			 to this component */
		color: goldenrod;
	}

	p:global(.red) {
		/* this will apply to all <p> elements belonging to this
			 component with a class of red, even if class="red" does
			 not initially appear in the markup, and is instead
			 added at runtime. This is useful when the class
			 of the element is dynamically applied, for instance
			 when updating the element's classList property directly. */
	}
</style>
```

If you want to make @keyframes that are accessible globally, you need to prepend your keyframe names with `-global-`.

The `-global-` part will be removed when compiled, and the keyframe then be referenced using just `my-animation-name` elsewhere in your code.

```html
<style>
  @keyframes -global-my-animation-name {
    ...;
  }
</style>
```

There should only be 1 top-level `<style>` tag per component.

However, it is possible to have `<style>` tag nested inside other elements or logic blocks.

In that case, the `<style>` tag will be inserted as-is into the DOM, no scoping or processing will be done on the `<style>` tag.

```html
<div>
  <style>
    /* this style tag will be inserted as-is */
    div {
      /* this will apply to all `<div>` elements in the DOM */
      color: red;
    }
  </style>
</div>
```
