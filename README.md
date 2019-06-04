# custom-elements-helper

A collection of Custom Elements helpers for the v1 spec.

This documentation is in alphabetical order. If you want a basic understanding of how things work, skip the Attributes & Elements chapters. It's most important to know how **BaseController** and **defineCustomElement** works. Everything else is optional.

## Attributes

Attributes are packages of properties & methods that you can mix in on your custom elements controllers.

**Important**: Usage on native HTML elements, e.g. `<img>` or `<a>`, is not possible due to browser support restrictions.

### Media

The `media` attribute adds media query support to your custom element.

#### Properties

 - `media` - `string` - Value of the media attribute
 - `matchesMedia` - `boolean` - True when the current viewport matches the media query

#### Methods

 - `whenMediaMatches()` - Returns a `Promise` that resolves once the media query first is matched
 - `whenMediaUnmatches()` - Returns a `Promise` that resolves once the media query first is unmatched
 - `watchMedia(match, unmatch)` - Takes two callbacks that are called when the media query matches and unmatches, respectively

#### Example usage

The following example will mixin the media attribute.

The `init().render().bind()` cycle from the base controller will only start once the viewport matches the `(min-width: 768px)` media query (because of the `resolve()` override).

##### Javascript

```js
import { defineCustomElement, BaseController, media } from '@mrhenry/custom-elements-helpers';

defineCustomElement('foo-bar', {
	attributes: [ media ],
	controller: class extends BaseController {

		resolve() {
			return Promise.all([
				super.resolve(),
				this.whenMediaMatches()
			]);
		}

	}
});
```

##### HTML

```html
<foo-bar media="(min-width: 768px)">
</foo-bar>
```

### Touch Hover

The `touch-hover` attribute adds touch support for hover interactions.
It adds `is-touch` and `is-hover` classes to your custom element so that you can style your animations accordingly.

#### Properties

 - `touchHover` - Returns `auto` when `touch-hover` is set. Else, returns `false`.

#### Methods

  - `enableTouchHover()` - Call this method inside the `bind` method of your custom element

This binds some methods to touchstart & click, so that it works like this:

On non-touch devices, a hover is a hover and a click is a click.

On touch devices, a first tap adds the `is-touch` class to the element. From this moment on you know that the current device is a touch device. The first tap also adds the `is-hover` class. A second tap removed the `is-hover` class.

It also makes sure the touch device's native `:hover` handling gets blocked properly so you can handle it like you wish.

#### Example usage

```js
import { defineCustomElement, BaseController, AttrTouchHover as touchHover } from '@mrhenry/custom-elements-helpers';

defineCustomElement('foo-bar', {
	attributes: [ touchHover ],
	controller: class extends BaseController {

		bind() {
			this.enableTouchHover();

			return this;
		}

	}
});
```

```html
<foo-bar class="foo-bar" touch-hover>
  Foo!

  <span class="foo-bar__show-on-hover">
    Bar!
  </span>
</foo-bar>
```

```css
.foo-bar {
  display: inline-block;
  position: relative;
}

.foo-bar__show-on-hover {
  display: none;
  position: absolute;
  left: 0;
  top: 120%;
  width: 100%;
}

.foo-bar:not(.is-touch):hover .foo-bar__show-on-hover,
.foo-bar.is-hover .foo-bar__show-on-hover {
	display: block;
}
```

## Controllers

Currently, there is only one controller, conveniently named **BaseController**.

### BaseController

It's important to extend from this controller if you create an element using `defineCustomElement` from the utils.

A BaseController instance is a standardized wrapper for your custom element logic. It lays out a consistent blueprint across developers & projects that streamlines the lifecycle of your controller.

#### Lifecycle: Birth

With Custom Elements, your controller gets triggered by your browser automatically when the element you defined gets attached to the DOM. This is what happens next:

##### Step 1: Resolve

The `resolve` method should return a `Promise`.
It allows you to wait for something, preload something, … If you want your controller to kick in immediately, return a resolved `Promise`, by using `return Promise.resolve(true)`.

The default behavior is to wait until `document.readyState === 'complete'`.

Once the promise has resolved, your custom element will have the `is-resolved` class attached. You can use this to style your element differently when it's in a loading state.

##### Step 2: Init

Once your custom element instance is resolved, the `init` method is called. You can do your initial setup here.

##### Step 3: Render

After your initial setup, the `render` method is called. You can assume a DOM-ready and configured environment here. `this.el` has a reference to the custom element DOM node so go wild (if you have to).

##### Step 4: Bind

With everything rendered, now's the time to attach your event listeners, using `this.on` and `this.once`. Read more below.

#### Working with events

There are four methods on the BaseController that will help you tremendously when working with events and custom elements. When you use these methods, you make sure that event listeners that you've added are removed when the custom element is no longer in the DOM etc.

You use `on(name, handler, target = null, options = false)` when you want to listen for an event. `target` falls back to `this.el`. You can also pass a selector in the name (e.g. `click .button`). When you do this, your handler gets a second argument pointing to the target.

Some examples:

```js
this.on('mouseenter', (e) => {
  console.log('Mouse entered the custom element');
});

this.on('click .button', (e, target) => {
  console.log('Click on', button.textContent');
});

this.on('mousemove', (e) => {
  console.log('Mouse move somewhere on body');
}, document.body);
```

The `once()` method has the same footprint but will remove itself after one event.

These event listeners can also be removed. Use `off(name, target = null)` to remove an event listener registered through `on`. `target` falls back to `this.el`.

Keep in mind that all targets for the same event should be removed separately. If you have a click handler on both `this.el` and `document.body`, you would have to call:

```js
this.off('click'); // Falls back to `this.el`
this.off('click', document.body);
```

A custom element can also emit events to communicate to other parts of your website.
Using `emit(name, data = {}, options = {})` you can easily pass around data.

The `data` object will be passed on to your handler as `e.detail`. The `options` object can have `bubbles` and `cancelable` as specified in the spec.

An example:

```js
// A setter on your `foo-bar` element
set current(to) {
  this._current = to;
  this.emit('foo-bar:current', { current: this._current });
}

// In another custom element its `bind()` method
this.on('foo-bar:current', (e) => {
  console.log(`Current changed to ${e.detail.current}`);
}, document.body);
```

#### Lifecycle: Death

When an element gets detached from the DOM, the BaseController goes through some housekeeping methods.

##### Step 1: Destroy

Remove the `is-resolved` class from the element.

##### Step 2: Unbind

Remove all event listeners that you registered through `on` or `once`.

## Elements

### AJAX Form

Wrap AJAX form around a working `<form>` to have it send over AJAX.
Form submits are supported over `GET`, `POST` and JSONP (with the `jsonp` attribute).

The AJAX form submits all form data to the form's `action`, using the form's `method`.

By default, it looks for an element with class `js-ajax-form-success` to show when the submit was successful. When a form submit is successful, the form will be removed (by default). Likewise, it looks for an element with class `js-ajax-form-error` to show an error message.

Override the default success & error handlers by overriding `onSuccess(res)` and `onError(err)`.

#### Roadmap

 - Client-side form validation
 - Handling server-side form validation
 - Per-field error messages

#### Attributes

 - `jsonp` - `boolean` - Needs JSONP for AJAX handling (e.g. createsend)

#### Example usage

```js
import { defineCustomElement, ajaxForm } from '@mrhenry/custom-elements-helpers';

defineCustomElement('my-ajax-form', {
	attributes: ajaxForm.attributes,
	controller: class extends ajaxForm.controller {

		onSuccess(res) {
			// Custom success handler
		}

		onError(err) {
			// Custom error handler
		}

	}
});
```

```html
<my-ajax-form>
	<form action="/subscribe" method="POST">
		<input type="email" name="email" />
		<input type="submit" value="Subscribe" />
	</form>
</my-ajax-form>
```


### Key Trigger

You can use key trigger to bind a key to an anchor. It'll look for the `href` attribute on itself or on the first child that has one and trigger the `click` event on it.

#### Attributes

 - `key` - `integer` - Key code of the key you want to listen for

#### Example usage

```js
import { defineCustomElement, keyTrigger } from '@mrhenry/custom-elements-helpers';

defineCustomElement('my-key-trigger', keyTrigger);
```

```html
<my-key-trigger key="37">
	<a href="/foo">Previous</a>
</my-key-trigger>

<my-key-trigger key="39">
	<a href="/bar">Next</a>
</my-key-trigger>
```

### Smooth State

Smooth State will listen for internal clicks and asynchronously fetch the contents and swap them, allowing you to transition between pages while not losing browser state.

*Warning: this has quite a few known bugs. Use with caution (and test in Safari)*

#### Methods

There are four public hooks where you can trigger animations. Each hook should return the `transition` object it gets passed in as an argument. You can make modifications to this object & they will adapt the transition accordingly.

 - `onBefore()` - Before the page is fetched
 - `onStart()` - While the page fetch is running, but before it is ready
 - `onReady()` - When the page fetch is ready, but before it is rendered
 - `onAfter()` - After the fetched page is rendered

#### Example usage

*This is kind of complex to demo, example will be added later.*

## Utilities

### Define

This exports the `defineCustomElement(tag, options = {})` method. Use this instead of `customElements.define` to register your custom elements.

The `tag` is the name of your custom element. The spec defined this to need a hypen. If in doubt, use the `mr`-prefix.

The `options` object is where the magic happens. Currently, a `attributes` and `controller` key is supported. `controller` is a class that extends from `BaseController` (see chapter Controllers).


`attributes` is an array of attributes that you want to support on your custom element. This removes repeating-yourself getters and setters into an easy to read syntax. You can also mix in more extensive behaviors from this library (see chapter Attributes). If you pass a mix-in it should provide a static `attachTo` method. Some examples below:


```js
import { AttrMedia as media } from '@mrhenry/custom-elements-helpers';

defineCustomElement('foo-bar', {
  attributes: [
    'stringattr',
    { attribute: 'intattr', type: 'int' },
    { attribute: 'boolattr', type: 'boolean' },
    media // We can do this because it exposes .attachTo
  ]
});
```

The type `int` parsed `this.intattr` as an integer, so it's an actual number value.
The type `boolean` makes sure `this.boolattr` is always boolean.
The type `string` is the default.

### Events

These methods are currently scoped for internal use only.

Quick heads up:
`parse` parses an event name like `click .button`
`getPath` is a cross-browser equivalent for `e.path` ([This should be made public](https://github.com/mrhenry/custom-elements-helpers/issues/6))

### HTML

`parseHTML(html, selector = null)` takes a string of HTML and returns an object `{ title, content, meta }`.

The title is the document title.
The content is the DOM node(s) matching your selector. If no selector is given, the whole parsed body will be returned.
The meta key holds an array of `{ name, property, content }` meta tags. This matches with the `<meta name="foo" property="bar" content="baz">`. The `property` attribute is only used by OpenGraph, AFAIK. Other meta tags will only have the `content` attribute. The name `viewport` is blacklisted, to avoid accidentaly setting or removing the viewport metatag.

`renderNodes(content, container)` takes a DOM node `content` and renders its children into `container`. This removes existing content from `container`.

`cleanNodes(nodes, selector)` takes a DOM node `nodes` and filters its child nodes against `selector`. If the child node matches `selector`, it gets removed from `nodes`. Keep in mind that this works on the reference itself so it will change the original DOM node.

## Polyfill

The `custom-elements.js` polyfill from [Polymer / webcomponents.org](https://github.com/webcomponents/webcomponentsjs) is included too. At the moment, it's best to copy paste it from the repo into your public folder. [Suggestions on how to improve this are welcome](https://github.com/mrhenry/custom-elements-helpers/issues/4).
