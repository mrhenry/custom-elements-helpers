'use strict';

function parse(name) {
	var clean = name.trim();
	var parts = clean.split(' ');

	var event = clean;
	var selector = null;

	if (parts.length > 1) {
		event = parts.shift();
		selector = parts.join(' ');
	}

	return { event: event, selector: selector };
}

function getPath(e) {
	var path = e.path;

	if (!path) {
		path = [e.target];
		var node = e.target;

		while (node.parentNode) {
			node = node.parentNode;
			path.push(node);
		}
	}

	return path;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var BaseController = function () {
	function BaseController(el) {
		var _this = this;

		classCallCheck(this, BaseController);

		this.el = el;

		this.resolve().then(function () {
			_this.el.classList.add('is-resolved');
			return _this.init().render().bind();
		});
	}

	createClass(BaseController, [{
		key: 'destroy',
		value: function destroy() {
			this.el.classList.remove('is-resolved');
			return this.unbind();
		}
	}, {
		key: 'resolve',
		value: function resolve() {
			return new Promise(function (resolve) {
				if (document.readyState === 'complete') {
					resolve();
				} else {
					var handler = function handler() {
						if (document.readyState === 'complete') {
							document.removeEventListener('readystatechange', handler, false);
							resolve();
						}
					};

					document.addEventListener('readystatechange', handler, false);
				}
			});
		}
	}, {
		key: 'init',
		value: function init() {
			return this;
		}
	}, {
		key: 'bind',
		value: function bind() {
			return this;
		}
	}, {
		key: 'render',
		value: function render() {
			return this;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			if (this._handlers) {
				this._handlers.forEach(function (listener) {
					listener.target.removeEventListener(listener.event, listener.handler, listener.options);
				});
			}

			return this;
		}
	}, {
		key: 'on',
		value: function on(name, handler) {
			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			this._handlers = this._handlers || [];

			var _parseEvent = parse(name),
			    event = _parseEvent.event,
			    selector = _parseEvent.selector;

			var parsedTarget = !target ? this.el : target;

			var wrappedHandler = function wrappedHandler(e) {
				handler(e, e.currentTarget);
			};

			if (selector) {
				wrappedHandler = function wrappedHandler(e) {
					var path = getPath(e);

					var currentTarget = path.find(function (tag) {
						return tag.matches && tag.matches(selector);
					});

					if (currentTarget) {
						handler(e, currentTarget);
					}
				};
			}

			var listener = {
				target: parsedTarget,
				selector: selector,
				event: event,
				handler: wrappedHandler,
				options: options
			};

			listener.target.addEventListener(listener.event, listener.handler, listener.options);

			this._handlers.push(listener);

			return this;
		}
	}, {
		key: 'once',
		value: function once(name, handler) {
			var _this2 = this;

			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var wrappedHandler = function wrappedHandler(e, currentTarget) {
				_this2.off(name, target);
				handler(e, currentTarget);
			};

			this.on(name, wrappedHandler, target, options);
		}
	}, {
		key: 'off',
		value: function off(name) {
			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var _parseEvent2 = parse(name),
			    event = _parseEvent2.event,
			    selector = _parseEvent2.selector;

			var parsedTarget = !target ? this.el : target;

			var listener = this._handlers.find(function (handler) {
				// Selectors don't match
				if (handler.selector !== selector) {
					return false;
				}

				// Event type don't match
				if (handler.event !== event) {
					return false;
				}

				// Passed a target, but the targets don't match
				if (!!parsedTarget && handler.target !== parsedTarget) {
					return false;
				}

				// Else, we found a match
				return true;
			});

			if (!!listener && !!listener.target) {
				this._handlers.splice(this._handlers.indexOf(listener), 1);

				listener.target.removeEventListener(listener.event, listener.handler, listener.options);
			}
		}
	}, {
		key: 'emit',
		value: function emit(name) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var params = Object.assign({
				detail: data,
				bubbles: true,
				cancelable: true
			}, options);

			var event = new CustomEvent(name, params);

			this.el.dispatchEvent(event);
		}
	}]);
	return BaseController;
}();

var addMethod = function addMethod(customElement, name, method) {
	if (typeof customElement.prototype[name] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + name);
	}

	customElement.prototype[name] = method;
};

var addGetter = function addGetter(customElement, name, method) {
	if (typeof customElement.prototype[name] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + name);
	}

	Object.defineProperty(customElement.prototype, name, {
		configurable: false,
		get: method
	});
};

var addProperty = function addProperty(customElement, name) {
	var getter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var setter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

	if (typeof customElement.prototype[name] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + name);
	}

	var noop = function noop() {};

	Object.defineProperty(customElement.prototype, name, {
		configurable: false,
		get: typeof getter === 'function' ? getter : noop,
		set: typeof setter === 'function' ? setter : noop
	});
};

var AttrMedia = function () {
	function AttrMedia() {
		classCallCheck(this, AttrMedia);
	}

	createClass(AttrMedia, null, [{
		key: 'attachTo',
		value: function attachTo(customElement) {
			// Adds customElement.media
			// @return string 		Value of `media=""` attribute
			addGetter(customElement, 'media', function getMediaAttribute() {
				return this.el.hasAttribute('media') ? this.el.getAttribute('media') : false;
			});

			// Adds customElement.matchesMedia
			// @return bool 		If the viewport currently matches the specified media query
			addGetter(customElement, 'matchesMedia', function matchesMedia() {
				if (!this.media) {
					return true;
				}

				return 'matchMedia' in window && !!window.matchMedia(this.media).matches;
			});

			// Adds customElements.whenMediaMatches()
			// @return Promise
			addMethod(customElement, 'whenMediaMatches', function whenMediaMatches() {
				var _this = this;

				var defer = new Promise(function (resolve) {
					var mq = void 0;

					var handler = function handler() {
						if (mq.matches) {
							resolve();
							mq.removeListener(handler);
						}
					};

					if ('matchMedia' in window) {
						mq = window.matchMedia(_this.media);
						mq.addListener(handler);
						handler(mq);
					} else {
						resolve();
					}
				});

				return defer;
			});
		}
	}]);
	return AttrMedia;
}();

{
	attributes: [{ attribute: 'key', type: 'int' }],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				this.elements = this.elements || {};

				if (this.el.hasAttribute('href')) {
					this.elements.target = this;
				} else {
					this.elements.target = this.el.querySelector('[href]');
				}

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.elements.target) {
					this.on('keyup', function (e) {
						if (e.which === _this2.key) {
							_this2.elements.target.click();
						}
					}, document.body);
				}

				return this;
			}
		}]);
		return controller;
	}(BaseController)
};

var parseMetaTag = function parseMetaTag() {
	var blacklist = ['viewport'];

	return function parse(tag) {
		var name = tag.getAttribute('name');
		var property = tag.getAttribute('property');
		var content = tag.getAttribute('content');

		if (!name && !property) {
			return false;
		}

		if (blacklist.includes(name)) {
			return false;
		}

		return { name: name, property: property, content: content };
	};
}();

var parseHTML = function parseHTML() {
	var parser = new DOMParser();

	return function parse(html) {
		var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var parsed = parser.parseFromString(html, 'text/html');

		// Get document title
		var title = parsed.title;

		// Get document nodes
		var content = parsed.body;

		if (selector) {
			content = parsed.body.querySelector(selector);

			if (!content) {
				throw new Error('not-found');
			}
		}

		// Get document meta
		var meta = Array.from(parsed.head.querySelectorAll('meta'), function (tag) {
			return parseMetaTag(tag);
		}).filter(function (t) {
			return !!t;
		});

		return { title: title, content: content, meta: meta };
	};
}();

function renderNodes(content, container) {
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild);
	}

	for (var i = content.children.length - 1; i >= 0; i -= 1) {
		var child = content.children[i];

		if (container.firstChild) {
			container.insertBefore(child, container.firstChild);
		} else {
			container.appendChild(child);
		}
	}
}

{
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'addToPath',
			value: function addToPath(href) {
				// Make sure `href` is an absolute path from the / root of the current site
				var absolutePath = href.replace(window.location.origin, '');
				absolutePath = absolutePath[0] !== '/' ? '/' + absolutePath : absolutePath;

				this._path = this._path || [];

				var from = void 0;

				if (this._path.length > 0) {
					from = this._path[this._path.length - 1].to;
				}

				var pathEntry = {
					from: from,
					to: absolutePath
				};

				this._path.push(pathEntry);

				return this;
			}
		}, {
			key: 'removeLatestFromPath',
			value: function removeLatestFromPath() {
				(this._path || []).pop();
				return this;
			}
		}, {
			key: 'pushState',
			value: function pushState(href) {
				var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
				var addToPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

				var state = { href: href, title: title };

				window.history.pushState(state, title, href);

				if (addToPath) {
					this.addToPath(href);
				}

				return this;
			}
		}, {
			key: 'replaceState',
			value: function replaceState(href) {
				var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
				var addToPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

				var state = { href: href, title: title };

				window.history.replaceState(state, title, href);

				if (addToPath) {
					this.addToPath(href);
				}

				return this;
			}
		}, {
			key: 'init',
			value: function init() {
				var href = window.location.href;
				var title = document.title;

				this.replaceState(href, title);

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				this.on('popstate', function (e) {
					if (e.state && e.state.href) {
						_this2.goTo(e.state.href, false).catch(function (err) {
							console.warn('Could not run popstate to', e.state.href);
							console.warn('Error:', err);
						});
					}
				}, window);

				this.on('click a', function (e) {
					var node = e.target;
					var path = Object.assign([], e.path);

					while (path.length > 0 && node && node.tagName && node.tagName.toLowerCase() !== 'a') {
						node = path.shift();

						// Not an `<a>` in the path if we arrived at the smoothState element
						if (node === _this2.el) {
							return;
						}
					}

					if (node.classList && node.classList.contains('js-mr-smooth-state-disable')) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();

					var href = node.getAttribute('href');
					_this2.goTo(href).catch(function (err) {
						console.warn('Could not navigate to', href);
						console.warn('Error:', err);
					});
				}, document.body);
			}
		}, {
			key: 'goTo',
			value: function goTo(href) {
				var _this3 = this;

				var pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

				return new Promise(function (resolve, reject) {
					window.dispatchEvent(new CustomEvent('smoothState:before'));

					document.body.classList.add('is-loading');

					_this3.addToPath(href);

					var cancel = function cancel(err) {
						_this3.removeLatestFromPath();
						reject(err);
					};

					var transition = {};
					transition.container = _this3.el;
					transition.path = Object.assign(_this3.latestPathEntry);

					return _this3.onBefore(transition).then(function () {
						fetch(href).then(function (res) {
							return res.text();
						}).then(function (html) {
							var _parseHTML = parseHTML(html, 'mr-smooth-state'),
							    title = _parseHTML.title,
							    content = _parseHTML.content;

							window.dispatchEvent(new CustomEvent('smoothState:start'));

							transition.fetched = { title: title, content: content };

							_this3.onStart(transition).then(function () {
								window.dispatchEvent(new CustomEvent('smoothState:ready'));

								_this3.onReady(transition).then(function () {
									var _transition$fetched = transition.fetched,
									    verifiedTitle = _transition$fetched.title,
									    verifiedContent = _transition$fetched.content;


									window.requestAnimationFrame(function () {
										renderNodes(verifiedContent, _this3.el);
										document.title = verifiedTitle;

										if (pushState) {
											// Don't add the state to the path
											_this3.pushState(href, verifiedTitle, false);
										}

										window.requestAnimationFrame(function () {
											document.body.classList.remove('is-loading');

											window.dispatchEvent(new CustomEvent('smoothState:after'));

											// You can't cancel the transition after the pushState
											// So we also resolve inside the catch
											_this3.onAfter(transition).then(function () {
												return resolve();
											}).catch(function () {
												return resolve();
											});
										});
									});
								}).catch(function (err) {
									return cancel(err);
								});
							}).catch(function (err) {
								return cancel(err);
							});
						}).catch(function (err) {
							return cancel(err);
						});
					}).catch(function (err) {
						return cancel(err);
					});
				});
			}
		}, {
			key: 'onBefore',
			value: function onBefore(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onStart',
			value: function onStart(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onReady',
			value: function onReady(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onAfter',
			value: function onAfter(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'path',
			get: function get$$1() {
				return this._path || [];
			}
		}, {
			key: 'latestPathEntry',
			get: function get$$1() {
				var length = this.path.length;

				if (length > 0) {
					return this.path[length - 1];
				}

				return undefined;
			}
		}]);
		return controller;
	}(BaseController)
};

var noop = function noop() {};

var generateStringAttributeMethods = function generateStringAttributeMethods(attribute) {
	var getter = function getter() {
		return this.el.getAttribute(attribute) || undefined;
	};

	var setter = function setter(to) {
		if (to) {
			this.el.setAttribute(attribute, to);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateBoolAttributeMethods = function generateBoolAttributeMethods(attribute) {
	var getter = function getter() {
		return !!this.el.hasAttribute(attribute);
	};

	var setter = function setter(to) {
		if (to) {
			this.el.setAttribute(attribute, attribute);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateIntegerAttributeMethods = function generateIntegerAttributeMethods(attribute) {
	var getter = function getter() {
		return parseInt(this.el.getAttribute(attribute), 10);
	};

	var setter = function setter(to) {
		var parsed = parseInt(to, 10);

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn('Could not set ' + attribute + ' to ' + to);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateNumberAttributeMethods = function generateNumberAttributeMethods(attribute) {
	var getter = function getter() {
		return parseFloat(this.el.getAttribute(attribute));
	};

	var setter = function setter(to) {
		var parsed = parseFloat(to);

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn('Could not set ' + attribute + ' to ' + to);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateAttributeMethods = function generateAttributeMethods(attribute) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'string';

	if (type === 'bool') {
		return generateBoolAttributeMethods(attribute);
	} else if (type === 'int' || type === 'integer') {
		return generateIntegerAttributeMethods(attribute);
	} else if (type === 'float' || type === 'number') {
		return generateNumberAttributeMethods(attribute);
	} else if (type === 'string') {
		return generateStringAttributeMethods(attribute);
	}
	return { getter: noop, setter: noop };
};

function defineCustomElement(tag) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	// Attach all passed attributes to the passed controller
	if (options.attributes && options.attributes.length) {
		options.attributes.forEach(function (attribute) {
			// String, sync with actual element attribute
			if (typeof attribute === 'string') {
				var _generateAttributeMet = generateAttributeMethods(attribute, 'string'),
				    getter = _generateAttributeMet.getter,
				    setter = _generateAttributeMet.setter;

				addProperty(options.controller, attribute, getter, setter);
			} else if (typeof attribute.attachTo === 'function') {
				attribute.attachTo(options.controller);
			} else if ((typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) === 'object') {
				var type = attribute.type || 'string';
				var name = attribute.attribute;

				var _generateAttributeMet2 = generateAttributeMethods(name, type),
				    _getter = _generateAttributeMet2.getter,
				    _setter = _generateAttributeMet2.setter;

				addProperty(options.controller, name, _getter, _setter);
			}
		});
	}

	return customElements.define(tag, function (_HTMLElement) {
		inherits(_class, _HTMLElement);

		function _class() {
			classCallCheck(this, _class);
			return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		createClass(_class, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this.controller = new options.controller(this);
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.controller.destroy();
			}
		}]);
		return _class;
	}(HTMLElement));
}

// Base Controller

var assert = window.chai.assert;
var mocha = window.mocha;

mocha.setup('tdd');

var instance = void 0;

var controller = function (_BaseController) {
	inherits(controller, _BaseController);

	function controller() {
		classCallCheck(this, controller);
		return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
	}

	createClass(controller, [{
		key: 'init',
		value: function init() {
			instance = this;
			return this;
		}
	}, {
		key: 'bind',
		value: function bind() {
			var _this2 = this;

			console.log('bind');

			this.whenMediaMatches().then(function () {
				console.log(1);
			});

			this.whenMediaUnmatches().then(function () {
				console.log(2);
			});

			this.watchMedia(function () {
				_this2.el.style.color = 'green';
				console.log('Media matched');
			}, function () {
				console.log('Media unmatched');
				_this2.el.style.color = 'red';
			});

			return this;
		}
	}, {
		key: 'render',
		value: function render() {
			mocha.run();
			return this;
		}
	}, {
		key: 'whenMediaUnmatches',
		value: function whenMediaUnmatches() {
			var _this3 = this;

			var defer = new Promise(function (resolve) {
				var mq = void 0;

				var handler = function handler() {
					if (!mq.matches) {
						resolve();
						mq.removeListener(handler);
					}
				};

				if ('matchMedia' in window) {
					mq = window.matchMedia(_this3.media);
					mq.addListener(handler);
					handler(mq);
				} else {
					resolve();
				}
			});

			return defer;
		}
	}, {
		key: 'watchMedia',
		value: function watchMedia() {
			var match = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
			var unmatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

			var mq = void 0;

			var handler = function handler() {
				if (mq.matches) {
					match();
				} else {
					unmatch();
				}
			};

			if ('matchMedia' in window) {
				mq = window.matchMedia(this.media);
				mq.addListener(handler);
				handler(mq);
			}
		}
	}]);
	return controller;
}(BaseController);

defineCustomElement('test-attr-media', {
	attributes: [AttrMedia],
	controller: controller
});

var node = document.createElement('test-attr-media');
node.setAttribute('media', '(min-width: 768px)');
node.innerHTML = 'This is a block element that has the media attribute.';

document.getElementsByClassName('js-demo')[0].appendChild(node);

customElements.whenDefined('test-attr-media');

suite('Attributes', function () {
	test('this.media returns a string value', function () {
		assert.equal(_typeof(instance.media), 'string');
	});

	test('this.media equals the media attribute value', function () {
		assert.equal(node.getAttribute('media'), instance.media);
	});

	test('this.matchesMedia returns a boolean value', function () {
		assert.equal(_typeof(instance.matchesMedia), 'boolean');
	});
});

suite('Methods', function () {
	test('this.whenMediaMatches() returns a Promise', function () {
		assert.equal(_typeof(instance.whenMediaMatches().then), 'function');
	});
});