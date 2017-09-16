import BaseController from '../controllers/base';

import {
	parseHTML,
	renderNodes,
	cleanNodes,
} from '../util/html';

export default {
	attributes: [],
	controller: class extends BaseController {

		/**
		 * `isShown` is a boolean that tracks
		 * if the overlay is currently open or not
		 * */
		get isShown() {
			return !!this._isShown;
		}

		set isShown(to) {
			this._isShown = !!to;
			this.el.classList.toggle('is-hidden', !this._isShown);
			this.el.classList.toggle('is-shown', this._isShown);
			document.body.classList.toggle('is-showing-overlay', this._isShown);
		}

		/**
		 * Original state is the History API state for the parent page
		 * (the page below the overlay)
		 * (not neccesarily the first page that was loaded)
		 * */
		get upState() {
			return Object.assign({}, this._upState);
		}

		set upState(to) {
			this._upState = Object.assign({}, to);
		}

		init() {
			// Store the original classes so we can always revert back to the default state
			// while rendering in different aspects
			this.originalClasses = Array.from(this.el.classList);

			this.stripFromResponse = ['link[rel="up"]', this.el.tagName];
		}

		/**
		 * This method gets run when a `<mr-overlay>`
		 * appears in the DOM, either after DOM ready
		 * or when HTML gets attached later on in the browsing session
		 */
		render() {
			// Store the original classes so we can always revert back to the default state
			// while rendering in different aspects
			this.originalClasses = Array.from(this.el.classList);

			// Add <link rel="up" href="/"> inside an overlay to fetch a background view
			const upLink = this.el.querySelector('link[rel="up"]');

			if (upLink) {
				const href = upLink.getAttribute('href');

				fetch(href, { credentials: 'include' }).then((res) => res.text()).then((html) => {
					const { title, content } = parseHTML(html);

					if (content) {
						if (content.getElementsByTagName(this.el.tagName)[0]) {
							const classList = content.getElementsByTagName(this.el.tagName)[0].classList;
							this.originalClasses = Array.from(classList);
						}

						const fragment = document.createDocumentFragment();

						// Clean certain selectors from the up state to avoid infinite loops
						const clean = cleanNodes(content, this.stripFromResponse);

						renderNodes(clean, fragment);

						this.el.parentNode.insertBefore(fragment, this.el);

						// The upState is not the overlay view but the background view
						this.upState = {
							href,
							title,
							root: true,
							by: this.el.tagName,
						};

						// We need to replace the current state to handle `popstate`
						const state = {
							href: window.location.href,
							title: document.title,
							root: false,
							by: this.el.tagName,
						};

						window.history.replaceState(state, state.title, state.href);

						// Set isShown so that the closing handler works correctly
						this.isShown = true;
					}
				});
			} else {
				// Currently not inside an overlay view, but an overlay might open
				// (because an empty <mr-overlay> is present)
				// so we store the current state to support `popstate` events
				const title = document.title;
				const href = window.location.href;

				this.upState = {
					href,
					title,
					root: true,
					by: this.el.tagName,
				};

				window.history.replaceState(this.upState, title, href);
			}

			return this;
		}

		bind() {
			const hideHandler = (e) => {
				if (this.isShown) {
					e.preventDefault();

					this.hide();

					if (this.upState) {
						const { title, href } = this.upState;

						window.history.pushState(this.upState, title, href);
						document.title = title;
					}
				}
			};

			this.on('click', (e) => {
				if (e.target === this.el) {
					hideHandler(e);
				}
			}, this.el);

			this.on('click .js-overlay-show', (e, target) => {
				const href = target.href;

				if (href) {
					e.preventDefault();
					this.show(href);
				}
			}, document.body);

			this.on('click .js-overlay-hide', (e) => {
				hideHandler(e);
			}, document.body);

			this.on('popstate', (e) => {
				// Only handle states that were set by `mr-overlay`
				// to avoid messing with other elements that use the History API
				if (e.state && e.state.by === this.el.tagName && e.state.href) {
					const { href, title } = e.state;
					const { href: upHref, title: upTitle } = this.upState;
					const hasRequestedUpState = href === upHref && title === upTitle;

					if (e.state.root && hasRequestedUpState) {
						// Trigger hide() if the popstate requests the root view
						this.hide();
						document.title = this.upState.title;
					} else {
						// Show the overlay() if we closed the overlay before
						this.show(e.state.href, false);
					}
				}
			}, window);

			return this;
		}

		show(href, pushState = true) {
			const updateMetaTags = (tags) => {
				tags.forEach((tag) => {
					let selector = 'meta';

					if (tag.property) {
						selector = `${selector}[property="${tag.property}"]`;
					}

					if (tag.name) {
						selector = `${selector}[name="${tag.name}"]`;
					}

					const match = document.head.querySelector(selector);

					if (match) {
						match.setAttribute('content', tag.content);
					} else {
						const append = document.createElement('meta');
						append.property = tag.property;
						append.content = tag.content;
						append.name = tag.name;
						document.head.appendChild(append);
					}
				});
			};

			const updateLinkTags = (tags) => {
				const allowed = ['canonical', 'alternate'];

				tags.forEach((tag) => {

				});
			};

			const renderContent = (content) => {
				const newClasses = Array.from(content.classList);
				this.el.className = '';
				// This crashes in IE11
				// this.el.classList.add(...newClasses);
				newClasses.forEach((c) => this.el.classList.add(c));

				this.isShown = true;

				// Clean certain selectors from the up state to avoid infinite loops
				const clean = cleanNodes(content, this.stripFromResponse);

				renderNodes(clean, this.el);

				window.requestAnimationFrame(() => {
					this.el.scrollTop = 0;
				});
			};

			const updateTitle = (title) => {
				document.title = title;
			};

			return fetch(href, { credentials: 'include' }).then((res) => res.text()).then((html) => {
				const { title, content, meta, links } = parseHTML(html, this.el.tagName);

				if (content) {
					updateMetaTags(meta);
					updateLinkTags(links);
					renderContent(content);
					updateTitle(title);

					if (pushState) {
						const state = { href, title, by: this.el.tagName };
						window.history.pushState(state, title, href);
					}
				}
			});
		}

		hide() {
			this.isShown = false;

			while (this.el.hasChildNodes()) {
				this.el.removeChild(this.el.firstChild);
			}

			if (this.originalClasses && Array.isArray(this.originalClasses)) {
				this.el.className = '';

				// This crashes in IE11
				// this.el.classList.add(...this.originalClasses);
				this.originalClasses.forEach((c) => this.el.classList.add(c));
			}
		}
	},
};
