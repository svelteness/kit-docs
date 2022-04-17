# Component Directives

## `on:*eventname*`

```svelte
on:eventname={handler}
```

Components can emit events using [createEventDispatcher](../runtime/svelte.md#createeventdispatcher), or by forwarding DOM events. Listening for component events looks the same as listening for DOM events:

```svelte
<SomeComponent on:whatever={handler}/>
```

As with DOM events, if the `on:` directive is used without a value, the component will _forward_ the event, meaning that a consumer of the component can listen for it.

```svelte
<SomeComponent on:whatever/>
```

## `--style-props`

```svelte
--style-props="anycssvalue"
```

You can also pass styles as props to components for the purposes of theming, using CSS custom properties.

Svelte's implementation is essentially syntactic sugar for adding a wrapper element. This example:

```svelte
<Slider
  bind:value
  min={0}
  --rail-color="black"
  --track-color="rgb(0, 0, 255)"
/>
```

Desugars to this:

```svelte
<div style="display: contents; --rail-color: black; --track-color: rgb(0, 0, 255)">
  <Slider
    bind:value
    min={0}
    max={100}
  />
</div>
```

**Note**: Since this is an extra `<div>`, beware that your CSS structure might accidentally target this. Be mindful of this added wrapper element when using this feature.

Svelte's CSS Variables support allows for easily themable components:

```svelte
<!-- Slider.svelte -->
<style>
  .potato-slider-rail {
    background-color: var(--rail-color, var(--theme-color, 'purple'));
  }
</style>
```

So you can set a high level theme color:

```css
/* global.css */
html {
  --theme-color: black;
}
```

Or override it at the consumer level:

```svelte
<Slider --rail-color="goldenrod"/>
```

## `bind:_property_`

```svelte
bind:property={variable}
```

You can bind to component props using the same syntax as for elements.

```svelte
<Keypad bind:value={pin}/>
```

## `bind:this`

```svelte
bind:this={component_instance}
```

Components also support `bind:this`, allowing you to interact with component instances programmatically.

:::admonition type=info

Note that we can't do `{cart.empty}` since `cart` is `undefined` when the button is first rendered and throws an error.

:::

```svelte
<ShoppingCart bind:this={cart}/>

<button on:click={() => cart.empty()}>
	Empty shopping cart
</button>
```

## `<slot>`

```svelte
<slot><!-- optional fallback --></slot>
```

```svelte
<slot name="x"><!-- optional fallback --></slot>
```

```svelte
<slot prop={value}></slot>
```

Components can have child content, in the same way that elements can.

The content is exposed in the child component using the `<slot>` element, which can contain fallback content that is rendered if no children are provided.

```svelte
<!-- Widget.svelte -->
<div>
	<slot>
		this fallback content will be rendered when no content is provided, like in the first example
	</slot>
</div>

<!-- App.svelte -->
<Widget></Widget> <!-- this component will render the default content -->

<Widget>
	<p>this is some child content that will overwrite the default slot content</p>
</Widget>
```

## `<slot name="`_name_`">`

Named slots allow consumers to target specific areas. They can also have fallback content.

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer"></slot>
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</Widget>
```

Components can be placed in a named slot using the syntax `<Component slot="name" />`.
In order to place content in a slot without using a wrapper element, you can use the special element `<svelte:fragment>`.

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer"></slot>
</div>

<!-- App.svelte -->
<Widget>
	<HeaderComponent slot="header" />
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

## `$$slots`

`$$slots` is an object whose keys are the names of the slots passed into the component by the parent. If the parent does not pass in a slot with a particular name, that name will not be present in `$$slots`. This allows components to render a slot (and other elements, like wrappers for styling) only if the parent provides it.

Note that explicitly passing in an empty named slot will add that slot's name to `$$slots`. For example, if a parent passes `<div slot="title" />` to a child component, `$$slots.title` will be truthy within the child.

```svelte
<!-- Card.svelte -->
<div>
	<slot name="title"></slot>
	{#if $$slots.description}
		<!-- This <hr> and slot will render only if a slot named "description" is provided. -->
		<hr>
		<slot name="description"></slot>
	{/if}
</div>

<!-- App.svelte -->
<Card>
	<h1 slot="title">Blog Post Title</h1>
	<!-- No slot named "description" was provided so the optional slot will not be rendered. -->
</Card>
```

## `<slot key={`_value_`}>`

Slots can be rendered zero or more times, and can pass values _back_ to the parent using props. The parent exposes the values to the slot template using the `let:` directive.

The usual shorthand rules apply — `let:item` is equivalent to `let:item={item}`, and `<slot {item}>` is equivalent to `<slot item={item}>`.

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot prop={item}></slot>
		</li>
	{/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:prop={thing}>
	<div>{thing.text}</div>
</FancyList>
```

Named slots can also expose values. The `let:` directive goes on the element with the `slot` attribute.

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" {item}></slot>
		</li>
	{/each}
</ul>

<slot name="footer"></slot>

<!-- App.svelte -->
<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```

## `<svelte:self>`

The `<svelte:self>` element allows a component to include itself, recursively.

It cannot appear at the top level of your markup; it must be inside an if or each block or passed to a component's slot to prevent an infinite loop.

```svelte
<script>
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count="{count - 1}"/>
{:else}
	<p>lift-off!</p>
{/if}
```

## `<svelte:component>`

```svelte
<svelte:component this={expression}/>
```

The `<svelte:component>` element renders a component dynamically, using the component constructor specified as the `this` property. When the property changes, the component is destroyed and recreated.

If `this` is falsy, no component is rendered.

```svelte
<svelte:component this={currentSelection.component} foo={bar}/>
```

## `<svelte:element>`

```svelte
<svelte:element this={expression}/>
```

The `<svelte:element>` element lets you render an element of a dynamically specified type. This is useful for example when rich text content from a CMS. If the tag is changed, the children will be preserved unless there's a transition attached to the element. Any properties and event listeners present will be applied to the element.

The only supported binding is `bind:this`, since the element type specific bindings that Svelte does at build time (e.g. `bind:value` for input elements) does not work with a dynamic tag type.

If `this` has a nullish value, a warning will be logged in development mode.

```svelte
<script>
	let tag = 'div';
	export let handler;
</script>

<svelte:element this={tag} on:click={handler}>Foo</svelte:element>
```

## `<svelte:window>`

```svelte
<svelte:window on:event={handler}/>
```

```svelte
<svelte:window bind:prop={value}/>
```

The `<svelte:window>` element allows you to add event listeners to the `window` object without worrying about removing them when the component is destroyed, or checking for the existence of `window` when server-side rendering.

Unlike `<svelte:self>`, this element may only appear the top level of your component and must never be inside a block or element.

```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window on:keydown={handleKeydown}/>
```

You can also bind to the following properties:

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — an alias for window.navigator.onLine

All except `scrollX` and `scrollY` are readonly.

```svelte
<svelte:window bind:scrollY={y}/>
```

:::admonition type=info

Note that the page will not be scrolled to the initial value to avoid accessibility issues. Only subsequent changes to the bound variable of `scrollX` and `scrollY` will cause scrolling. However, if the scrolling behaviour is desired, call `scrollTo()` in `onMount()`.

:::

## `<svelte:body>`

```svelte
<svelte:body on:event={handler}/>
```

Similarly to `<svelte:window>`, this element allows you to add listeners to events on `document.body`, such as `mouseenter` and `mouseleave`, which don't fire on `window`. It also lets you use [actions](./element-directives.md#useaction) on the `<body>` element.

As with `<svelte:window>`, this element may only appear the top level of your component and must never be inside a block or element.

```svelte
<svelte:body
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
	use:someAction
/>
```

## `<svelte:head>`

```svelte
<svelte:head>...</svelte:head>
```

This element makes it possible to insert elements into `document.head`. During server-side rendering, `head` content is exposed separately to the main `html` content.

As with `<svelte:window>` and `<svelte:body>`, this element may only appear at the top level of your component and must never be inside a block or element.

```svelte
<svelte:head>
	<link rel="stylesheet" href="/tutorial/dark-theme.css">
</svelte:head>
```

## `<svelte:options>`

```svelte
<svelte:options option={value}/>
```

The `<svelte:options>` element provides a place to specify per-component compiler options, which are detailed in the [compiler section](../compiler/compile.md). The possible options are:

- `immutable={true}` — you never use mutable data, so the compiler can do simple referential equality checks to determine if values have changed
- `immutable={false}` — the default. Svelte will be more conservative about whether or not mutable objects have changed
- `accessors={true}` — adds getters and setters for the component's props
- `accessors={false}` — the default
- `namespace="..."` — the namespace where this component will be used, most commonly "svg"; use the "foreign" namespace to opt out of case-insensitive attribute names and HTML-specific warnings
- `tag="..."` — the name to use when compiling this component as a custom element

```svelte
<svelte:options tag="my-custom-element"/>
```

## `<svelte:fragment>`

The `<svelte:fragment>` element allows you to place content in a [named slot](#slot-name"name") without wrapping it in a container DOM element. This keeps the flow layout of your document intact.

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer"></slot>
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```
