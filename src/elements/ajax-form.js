import BaseController from '../controllers/base';
import fetchJSONP from '../util/fetch';

const ajaxForm = {
	attributes: [
		{ attribute: 'jsonp', type: 'string' },
	],
	controller: class extends BaseController {
		get action() {
			try {
				return new URL(this.elements.form.action);
			} catch (e) {
				return new URL(this.elements.form.action, window.location.origin);
			}
		}

		get method() {
			if (typeof this.jsonp !== 'undefined') {
				return 'GET';
			}

			return (this.elements.form.method || 'POST').toUpperCase();
		}

		get values() {
			return new FormData(this.elements.form);
		}

		init() {
			this.elements = this.elements || {};
			this.elements.form = this.el.getElementsByTagName('form').item(0);
			this.elements.successMessage = this.el.getElementsByClassName('js-ajax-form-success').item(0);
			this.elements.errorMessage = this.el.getElementsByClassName('js-ajax-form-error').item(0);

			if (!this.elements.form) {
				console.warn('Activated MrAjaxForm without a form');
			} else {
				this.elements.fields = this.elements.form.getElementsByTagName('input');
			}
		}

		render() {
			// We can disable the HTML5 front-end validation
			// and handle it more gracefully in JS
			// @todo
			this.elements.form.setAttribute('novalidate', 'novalidate');
		}

		bind() {
			const reset = () => {
				if (this.elements.successMessage) {
					this.elements.successMessage.setAttribute('hidden', 'hidden');
				}

				if (this.elements.errorMessage) {
					this.elements.errorMessage.setAttribute('hidden', 'hidden');
				}
			};

			this.on('submit', (e) => {
				e.preventDefault();

				reset();

				const { url, params } = this.prepare(this.method);

				this.submit(url, params)
					.then((data) => {
						this.onSuccess(data);
					}, (err) => {
						this.onError(err);
					});
			}, this.elements.form);
		}

		prepare(method) {
			const get = () => {
				const url = new URL(this.action);

				Array.from(this.values.entries()).forEach(([key, value]) => {
					url.searchParams.append(key, value);
				});

				const params = {
					method: 'GET',
					headers: new Headers({
						'Content-Type': 'application/json',
					}),
				};

				return { url, params };
			};

			const post = () => {
				const url = new URL(this.action);

				const params = {
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/x-www-form-urlencoded',
					}),
					body: this.values,
				};

				return { url, params };
			};

			if (method.toUpperCase() === 'GET') {
				return get();
			}

			if (method.toUpperCase() === 'POST') {
				return post();
			}

			return { url: '/', params: { method: 'GET' } };
		}

		submit(url, params = {}) {
			if (typeof this.jsonp !== 'undefined') {
				return fetchJSONP(url, this.jsonp === '' ? undefined : this.jsonp);
			}

			return fetch(url, params).then((res) => {
				if (res.ok) {
					return res;
				}

				const error = new Error(res.statusText);
				throw error;
			}).then((res) => {
				const type = res.headers.get('Content-Type');

				if (type && type.includes('application/json')) {
					return res.json();
				}

				return res.text();
			});
		}

		// eslint-disable-next-line no-unused-vars
		onSuccess(res) {
			if (this.elements.successMessage) {
				this.elements.successMessage.removeAttribute('hidden');
			}

			this.elements.form.parentNode.removeChild(this.elements.form);
		}

		// eslint-disable-next-line no-unused-vars
		onError(err) {
			if (this.elements.errorMessage) {
				this.elements.errorMessage.removeAttribute('hidden');
			}
		}
	},
};

export default ajaxForm;
