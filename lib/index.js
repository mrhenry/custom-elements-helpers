'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
	if (e.path) {
		return e.path;
	}

	var path = [e.target];
	var node = e.target;

	while (node.parentNode) {
		node = node.parentNode;
		path.push(node);
	}

	return path;
}

function promisify(method) {
	return new Promise(function (resolve, reject) {
		var wait = method();

		if (wait instanceof Promise) {
			wait.then(function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				resolve(args);
			}, function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				reject(args);
			});
		} else {
			resolve(wait);
		}
	});
}

function waitForDOMReady() {
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

function elementIsInDOM(element) {
	var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

	if (!element) {
		return false;
	}

	if (element === root) {
		return false;
	}

	return root.contains(element);
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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



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





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var BASE_CONTROLLER_HANDLERS = Symbol('BASE_CONTROLLER_HANDLERS');

var BaseController = function () {
	function BaseController(el) {
		var _this = this;

		classCallCheck(this, BaseController);

		this.el = el;

		this.resolve().then(function () {
			if (!elementIsInDOM(_this.el)) {
				return Promise.reject(new Error('The element has disappeared'));
			}

			_this.el.classList.add('is-resolved');

			var init = function init() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject(new Error('The element has disappeared'));
					}

					return _this.init();
				});
			};

			var render = function render() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject(new Error('The element has disappeared'));
					}

					return _this.render();
				});
			};

			var bind = function bind() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject(new Error('The element has disappeared'));
					}

					return _this.bind();
				});
			};

			return init().then(function () {
				return render().then(function () {
					return bind().then(function () {
						return _this;
					});
				});
			});
		}, function () {});
	}

	createClass(BaseController, [{
		key: 'destroy',
		value: function destroy() {
			this.el.classList.remove('is-resolved');
		}
	}, {
		key: 'resolve',
		value: function resolve() {
			return waitForDOMReady();
		}
	}, {
		key: 'init',
		value: function init() {}
	}, {
		key: 'render',
		value: function render() {}
	}, {
		key: 'bind',
		value: function bind() {}
	}, {
		key: 'unbind',
		value: function unbind() {
			if (this[BASE_CONTROLLER_HANDLERS]) {
				this[BASE_CONTROLLER_HANDLERS].forEach(function (listener) {
					listener.target.removeEventListener(listener.event, listener.handler, listener.options);
				});

				this[BASE_CONTROLLER_HANDLERS] = [];
			}
		}
	}, {
		key: 'on',
		value: function on(name, handler) {
			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			this[BASE_CONTROLLER_HANDLERS] = this[BASE_CONTROLLER_HANDLERS] || [];

			var _parseEvent = parse(name),
			    event = _parseEvent.event,
			    selector = _parseEvent.selector;

			var parsedTarget = !target ? this.el : target;

			var wrappedHandler = function wrappedHandler(e) {
				handler(e, e.target);
			};

			if (selector) {
				wrappedHandler = function wrappedHandler(e) {
					var path = getPath(e);

					var matchingTarget = path.find(function (tag) {
						return tag.matches && tag.matches(selector);
					});

					if (matchingTarget) {
						handler(e, matchingTarget);
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

			this[BASE_CONTROLLER_HANDLERS].push(listener);

			return this;
		}
	}, {
		key: 'once',
		value: function once(name, handler) {
			var _this2 = this;

			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var wrappedHandler = function wrappedHandler(e, matchingTarget) {
				_this2.off(name, target);
				handler(e, matchingTarget);
			};

			this.on(name, wrappedHandler, target, options);
		}
	}, {
		key: 'off',
		value: function off(name) {
			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			this[BASE_CONTROLLER_HANDLERS] = this[BASE_CONTROLLER_HANDLERS] || [];

			var _parseEvent2 = parse(name),
			    event = _parseEvent2.event,
			    selector = _parseEvent2.selector;

			var parsedTarget = !target ? this.el : target;

			var listener = this[BASE_CONTROLLER_HANDLERS].find(function (handler) {
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
				this[BASE_CONTROLLER_HANDLERS].splice(this[BASE_CONTROLLER_HANDLERS].indexOf(listener), 1);

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

var convertAttributeToPropertyName = function convertAttributeToPropertyName(attribute) {
	return attribute.split('-').reduce(function (camelcased, part, index) {
		if (index === 0) {
			return part;
		}

		return camelcased + part[0].toUpperCase() + part.substr(1);
	});
};

var addMethod = function addMethod(customElement, name, method) {
	if (typeof customElement.prototype[name] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + name);
	}

	customElement.prototype[name] = method;
};

var addGetter = function addGetter(customElement, name, method) {
	var getterName = convertAttributeToPropertyName(name);

	if (typeof customElement.prototype[getterName] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + getterName);
	}

	Object.defineProperty(customElement.prototype, getterName, {
		configurable: false,
		get: method
	});
};

var addProperty = function addProperty(customElement, name) {
	var getter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var setter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

	var propertyName = convertAttributeToPropertyName(name);

	if (typeof customElement.prototype[propertyName] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + propertyName);
	}

	var noop = function noop() {};

	var property = {
		configurable: false,
		get: typeof getter === 'function' ? getter : noop,
		set: typeof setter === 'function' ? setter : noop
	};

	var descriptor = Object.getOwnPropertyDescriptor(customElement.prototype, propertyName);

	if (descriptor) {
		if (typeof descriptor.set === 'function') {
			var existing = descriptor.set;

			property.set = function set(to) {
				existing.call(this, to);
			};
		}

		if (typeof descriptor.get === 'function') {
			var generated = property.get;
			var _existing = descriptor.get;

			property.get = function get() {
				var value = _existing.call(this);

				if (typeof value !== 'undefined') {
					return value;
				}

				return generated.call(this);
			};
		}
	}

	Object.defineProperty(customElement.prototype, propertyName, property);
};

var AttrMedia = function () {
	function AttrMedia() {
		classCallCheck(this, AttrMedia);
	}

	createClass(AttrMedia, null, [{
		key: 'attachTo',
		value: function attachTo(customElement) {
			var noop = function noop() {};

			var watchers = {};

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
					var handler = function handler(media) {
						if (media.matches) {
							resolve();
							media.removeListener(handler);
						}
					};

					if ('matchMedia' in window) {
						watchers[_this.media] = watchers[_this.media] || window.matchMedia(_this.media);
						watchers[_this.media].addListener(function () {
							return handler(watchers[_this.media]);
						});
						handler(watchers[_this.media]);
					} else {
						resolve();
					}
				});

				return defer;
			});

			// Adds customElements.whenMediaUnmatches()
			// @return Promise
			addMethod(customElement, 'whenMediaUnmatches', function whenMediaUnmatches() {
				var _this2 = this;

				var defer = new Promise(function (resolve) {
					var handler = function handler(media) {
						if (!media.matches) {
							resolve();
							media.removeListener(handler);
						}
					};

					if ('matchMedia' in window) {
						watchers[_this2.media] = watchers[_this2.media] || window.matchMedia(_this2.media);
						watchers[_this2.media].addListener(function () {
							return handler(watchers[_this2.media]);
						});
						handler(watchers[_this2.media]);
					} else {
						resolve();
					}
				});

				return defer;
			});

			addMethod(customElement, 'watchMedia', function watchMedia() {
				var _this3 = this;

				var match = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
				var unmatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

				var handler = function handler(media) {
					if (media.matches) {
						match();
					} else {
						unmatch();
					}
				};

				if ('matchMedia' in window) {
					watchers[this.media] = watchers[this.media] || window.matchMedia(this.media);
					watchers[this.media].addListener(function () {
						return handler(watchers[_this3.media]);
					});
					handler(watchers[this.media]);
				}
			});
		}
	}]);
	return AttrMedia;
}();

var AttrTouchHover = function () {
	function AttrTouchHover() {
		classCallCheck(this, AttrTouchHover);
	}

	createClass(AttrTouchHover, null, [{
		key: 'attachTo',
		value: function attachTo(customElement) {
			var isTouch = false;
			var isTouched = false;

			var touchClass = 'is-touch';
			var hoverClass = 'is-touch-hover';

			addGetter(customElement, 'touchHover', function getTouchHoverAttribute() {
				if (this.el.hasAttribute('touch-hover')) {
					// @todo - Support different values for touch-hover
					// `auto`        detect based on element
					// `toggle`      always toggle hover on/off (this might block clicks)
					// `passthrough` ignore hover, directly trigger action
					return 'auto';
				}

				return false;
			});

			addMethod(customElement, 'enableTouchHover', function enableTouchHover() {
				var _this = this;

				this.on('touchstart', function () {
					isTouch = true;
					_this.el.classList.add(touchClass);
				}, this.el, { useCapture: true });

				this.on('touchstart', function (e) {
					var path = getPath(e);

					// Remove hover when tapping outside the DOM node
					if (isTouched && !path.includes(_this.el)) {
						isTouch = false;
						isTouched = false;
						_this.el.classList.remove(hoverClass);
					}
				}, document.body, { useCapture: true });

				this.on('click', function (e) {
					if (_this.touchHover) {
						var hasAction = _this.el.getAttribute('href') !== '#';

						if (!isTouched && !hasAction) {
							e.preventDefault();
						}

						if (isTouch) {
							if (hasAction) {
								if (!isTouched) {
									// First tap, enable hover, block tap
									e.preventDefault();
									isTouched = true;
								} else {
									// Second tap, don't block tap, disable hover
									isTouched = false;
								}
							} else {
								// Act as a simple on/off switch
								isTouched = !isTouched;
							}

							_this.el.classList.toggle(hoverClass, isTouched);
						}
					}
				}, this.el, { useCapture: true });
			});
		}
	}]);
	return AttrTouchHover;
}();

var parseResponse = function parseResponse(res) {
	var data = function parseResonseToData() {
		// Force lowercase keys
		if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') {
			return Object.entries(res).reduce(function (object, _ref) {
				var _ref2 = slicedToArray(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				var lowercaseKey = key.toLowerCase();

				Object.assign(object, defineProperty({}, lowercaseKey, value));

				return object;
			}, {});
		}

		return res;
	}();

	var status = function parseResponseToStatus() {
		if (data.status) {
			return parseInt(data.status, 10);
		}

		if (parseInt(data, 10).toString() === data.toString()) {
			return parseInt(data, 10);
		}

		return 200;
	}();

	return { status: status, data: data };
};

var fetchJSONP = function fetchJSONP(url) {
	return new Promise(function (resolve, reject) {
		// Register a global callback
		// Make sure we have a unique function name
		var now = new Date().getTime();
		var callback = 'AJAX_FORM_CALLBACK_' + now;

		window[callback] = function (res) {
			// Make the callback a noop
			// so it triggers only once (just in case)
			window[callback] = function () {};

			// Clean up after ourselves
			var script = document.getElementById(callback);
			script.parentNode.removeChild(script);

			var _parseResponse = parseResponse(res),
			    status = _parseResponse.status,
			    data = _parseResponse.data;

			// If res is only a status code


			if (status >= 200 && status <= 399) {
				return resolve(data);
			}

			return reject(data);
		};

		var script = document.createElement('script');
		script.id = callback;
		script.src = url + '&callback=' + callback;
		document.head.appendChild(script);
	});
};

var ajaxForm = {
	attributes: [{ attribute: 'jsonp', type: 'bool' }],
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
				this.elements.form = this.el.getElementsByTagName('form').item(0);
				this.elements.successMessage = this.el.getElementsByClassName('js-ajax-form-success').item(0);
				this.elements.errorMessage = this.el.getElementsByClassName('js-ajax-form-error').item(0);

				if (!this.elements.form) {
					console.warn('Activated MrAjaxForm without a form');
				} else {
					this.elements.fields = this.elements.form.getElementsByTagName('input');
				}
			}
		}, {
			key: 'render',
			value: function render() {
				// We can disable the HTML5 front-end validation
				// and handle it more gracefully in JS
				// @todo
				this.elements.form.setAttribute('novalidate', 'novalidate');
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				var reset = function reset() {
					if (_this2.elements.successMessage) {
						_this2.elements.successMessage.setAttribute('hidden', 'hidden');
					}

					if (_this2.elements.errorMessage) {
						_this2.elements.errorMessage.setAttribute('hidden', 'hidden');
					}
				};

				this.on('submit', function (e) {
					e.preventDefault();

					reset();

					var _prepare = _this2.prepare(_this2.method),
					    url = _prepare.url,
					    params = _prepare.params;

					_this2.submit(url, params).then(function (data) {
						_this2.onSuccess(data);
					}, function (err) {
						_this2.onError(err);
					});
				}, this.elements.form);
			}
		}, {
			key: 'prepare',
			value: function prepare(method) {
				var _this3 = this;

				var get$$1 = function get$$1() {
					var url = new URL(_this3.action);

					Array.from(_this3.values.entries()).forEach(function (_ref) {
						var _ref2 = slicedToArray(_ref, 2),
						    key = _ref2[0],
						    value = _ref2[1];

						url.searchParams.append(key, value);
					});

					var params = {
						method: 'GET',
						headers: new Headers({
							'Content-Type': 'application/json'
						})
					};

					return { url: url, params: params };
				};

				var post = function post() {
					var url = new URL(_this3.action);

					var params = {
						method: 'POST',
						headers: new Headers({
							'Content-Type': 'application/x-www-form-urlencoded'
						}),
						body: _this3.values
					};

					return { url: url, params: params };
				};

				if (method.toUpperCase() === 'GET') {
					return get$$1();
				}

				if (method.toUpperCase() === 'POST') {
					return post();
				}

				return { url: '/', params: { method: 'GET' } };
			}
		}, {
			key: 'submit',
			value: function submit(url) {
				var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				if (this.jsonp) {
					return fetchJSONP(url);
				}

				return fetch(url, params).then(function (res) {
					if (res.ok) {
						return res;
					}

					var error = new Error(res.statusText);
					throw error;
				}).then(function (res) {
					var type = res.headers.get('Content-Type');

					if (type && type.includes('application/json')) {
						return res.json();
					}

					return res.text();
				});
			}

			// eslint-disable-next-line no-unused-vars

		}, {
			key: 'onSuccess',
			value: function onSuccess(res) {
				if (this.elements.successMessage) {
					this.elements.successMessage.removeAttribute('hidden');
				}

				this.elements.form.parentNode.removeChild(this.elements.form);
			}

			// eslint-disable-next-line no-unused-vars

		}, {
			key: 'onError',
			value: function onError(err) {
				if (this.elements.errorMessage) {
					this.elements.errorMessage.removeAttribute('hidden');
				}
			}
		}, {
			key: 'action',
			get: function get$$1() {
				try {
					return new URL(this.elements.form.action);
				} catch (e) {
					return new URL(this.elements.form.action, window.location.origin);
				}
			}
		}, {
			key: 'method',
			get: function get$$1() {
				if (this.jsonp) {
					return 'GET';
				}

				return (this.elements.form.method || 'POST').toUpperCase();
			}
		}, {
			key: 'values',
			get: function get$$1() {
				return new FormData(this.elements.form);
			}
		}]);
		return controller;
	}(BaseController)
};

var keyTrigger = {
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
							e.preventDefault();
							e.stopPropagation();

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

		var title = parsed.title,
		    head = parsed.head;
		var content = parsed.body;


		if (selector) {
			content = content.querySelector(selector);

			if (!content) {
				throw new Error('not-found');
			}
		}

		// Get document meta
		var meta = Array.from(head.querySelectorAll('meta'), function (tag) {
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

	var images = Array.from(content.querySelectorAll('img'));

	images.forEach(function (img) {
		var clone = document.createElement('img');

		var attributes = Array.from(img.attributes);

		attributes.forEach(function (attribute) {
			clone.setAttributeNode(attribute.cloneNode(true));
		});

		img.parentNode.replaceChild(clone, img);

		return clone;
	});

	if (content instanceof DocumentFragment) {
		container.appendChild(content);
	} else {
		for (var i = content.children.length - 1; i >= 0; i -= 1) {
			var child = content.children[i];

			if (container.firstChild) {
				container.insertBefore(child, container.firstChild);
			} else {
				container.appendChild(child);
			}
		}
	}
}

function cleanNodes(nodes, selector) {
	if (!selector || Array.isArray(selector) && selector.length === 0) {
		return nodes;
	}

	var stringSelector = Array.isArray(selector) ? selector.join(', ') : selector;

	var bloat = Array.from(nodes.querySelectorAll(stringSelector));

	bloat.forEach(function (node) {
		return node.parentNode.removeChild(node);
	});

	return nodes;
}

var overlay = {
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
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

		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				// Store the original classes so we can always revert back to the default state
				// while rendering in different aspects
				this.originalClasses = Array.from(this.el.classList);

				// Add <link rel="up" href="/"> inside an overlay to fetch a background view
				var upLink = this.el.querySelector('link[rel="up"]');

				if (upLink) {
					var href = upLink.getAttribute('href');

					fetch(href, { credentials: 'include' }).then(function (res) {
						return res.text();
					}).then(function (html) {
						var _parseHTML = parseHTML(html),
						    title = _parseHTML.title,
						    content = _parseHTML.content;

						if (content) {
							if (content.getElementsByTagName(_this2.el.tagName).item(0)) {
								var original = content.getElementsByTagName(_this2.el.tagName).item(0);
								_this2.originalClasses = Array.from(original.classList);
							}

							var fragment = document.createDocumentFragment();

							// Clean certain selectors from the up state to avoid infinite loops
							var clean = cleanNodes(content, _this2.stripFromResponse);

							renderNodes(clean, fragment);

							_this2.el.parentNode.insertBefore(fragment, _this2.el);

							// The upState is not the overlay view but the background view
							_this2.upState = {
								href: href,
								title: title,
								root: true,
								by: _this2.el.tagName
							};

							// We need to replace the current state to handle `popstate`
							var state = {
								href: window.location.href,
								title: document.title,
								root: false,
								by: _this2.el.tagName
							};

							window.history.replaceState(state, state.title, state.href);

							// Set isShown so that the closing handler works correctly
							_this2.isShown = true;
						}
					});
				} else {
					// Currently not inside an overlay view, but an overlay might open
					// (because an empty <mr-overlay> is present)
					// so we store the current state to support `popstate` events
					this.upState = {
						href: window.location.href,
						title: document.title,
						root: true,
						by: this.el.tagName
					};

					window.history.replaceState(this.upState, this.upState.title, this.upState.href);
				}

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this3 = this;

				var hideHandler = function hideHandler(e) {
					if (_this3.isShown) {
						e.preventDefault();

						_this3.hide();

						if (_this3.upState) {
							var _upState = _this3.upState,
							    title = _upState.title,
							    href = _upState.href;


							window.history.pushState(_this3.upState, title, href);
							document.title = title;
						}
					}
				};

				this.on('click', function (e) {
					if (e.target === _this3.el) {
						hideHandler(e);
					}
				}, this.el);

				this.on('click .js-overlay-show', function (e, target) {
					if (target.href) {
						e.preventDefault();
						_this3.show(target.href);
					}
				}, document.body);

				this.on('click .js-overlay-hide', function (e) {
					hideHandler(e);
				}, document.body);

				this.on('popstate', function (e) {
					// Only handle states that were set by `mr-overlay`
					// to avoid messing with other elements that use the History API
					if (e.state && e.state.by === _this3.el.tagName && e.state.href) {
						var _e$state = e.state,
						    href = _e$state.href,
						    title = _e$state.title;
						var _upState2 = _this3.upState,
						    upHref = _upState2.href,
						    upTitle = _upState2.title;

						var hasRequestedUpState = href === upHref && title === upTitle;

						if (e.state.root && hasRequestedUpState) {
							// Trigger hide() if the popstate requests the root view
							_this3.hide();
							document.title = _this3.upState.title;
						} else {
							// Show the overlay() if we closed the overlay before
							_this3.show(e.state.href, false);
						}
					}
				}, window);

				return this;
			}
		}, {
			key: 'show',
			value: function show(href) {
				var _this4 = this;

				var pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

				var updateMetaTags = function updateMetaTags(tags) {
					tags.forEach(function (tag) {
						var selector = 'meta';

						if (tag.property) {
							selector = selector + '[property="' + tag.property + '"]';
						}

						if (tag.name) {
							selector = selector + '[name="' + tag.name + '"]';
						}

						var match = document.head.querySelector(selector);

						if (match) {
							match.setAttribute('content', tag.content);
						} else {
							var append = document.createElement('meta');
							append.property = tag.property;
							append.content = tag.content;
							append.name = tag.name;
							document.head.appendChild(append);
						}
					});
				};

				var renderContent = function renderContent(content) {
					var newClasses = Array.from(content.classList);
					_this4.el.className = '';
					// This crashes in IE11
					// this.el.classList.add(...newClasses);
					newClasses.forEach(function (c) {
						return _this4.el.classList.add(c);
					});

					_this4.isShown = true;

					// Clean certain selectors from the up state to avoid infinite loops
					var clean = cleanNodes(content, _this4.stripFromResponse);

					renderNodes(clean, _this4.el);

					window.requestAnimationFrame(function () {
						_this4.el.scrollTop = 0;
					});
				};

				var updateTitle = function updateTitle(title) {
					document.title = title;
				};

				return fetch(href, { credentials: 'include' }).then(function (res) {
					return res.text();
				}).then(function (html) {
					var _parseHTML2 = parseHTML(html, _this4.el.tagName),
					    title = _parseHTML2.title,
					    content = _parseHTML2.content,
					    meta = _parseHTML2.meta;

					updateMetaTags(meta);

					if (content) {
						renderContent(content);
						updateTitle(title);

						if (pushState) {
							var state = { href: href, title: title, by: _this4.el.tagName };
							window.history.pushState(state, title, href);
						}
					}
				});
			}
		}, {
			key: 'hide',
			value: function hide() {
				var _this5 = this;

				this.isShown = false;

				while (this.el.hasChildNodes()) {
					this.el.removeChild(this.el.firstChild);
				}

				if (this.originalClasses && Array.isArray(this.originalClasses)) {
					this.el.className = '';

					// This crashes in IE11
					// this.el.classList.add(...this.originalClasses);
					this.originalClasses.forEach(function (c) {
						return _this5.el.classList.add(c);
					});
				}
			}
		}, {
			key: 'isShown',

			/**
    * `isShown` is a boolean that tracks
    * if the overlay is currently open or not
    * */
			get: function get$$1() {
				return !!this._isShown;
			},
			set: function set$$1(to) {
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

		}, {
			key: 'upState',
			get: function get$$1() {
				return Object.assign({}, this._upState);
			},
			set: function set$$1(to) {
				this._upState = Object.assign({}, to);
			}
		}]);
		return controller;
	}(BaseController)
};

var getMetaValues = function getMetaValues() {
	var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.head;
	var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	var extractKey = function extractKey(tag) {
		var raw = tag.getAttribute('name');

		if (!raw) {
			raw = tag.getAttribute('property');
		}

		var stripped = raw.match(/^(?:.*:)?(.*)$/i);

		if (stripped) {
			return stripped[1];
		}

		return null;
	};

	var tags = [].concat(toConsumableArray(node.querySelectorAll('meta' + selector)));

	// Get <meta> values
	return tags.reduce(function (carry, tag) {
		var key = extractKey(tag);

		if (key) {
			var value = tag.getAttribute('content');
			Object.assign(carry, defineProperty({}, key, value));
		}

		return carry;
	}, {});
};

var generateQuerystring = function generateQuerystring(params) {
	var querystring = Object.entries(params).map(function (_ref) {
		var _ref2 = slicedToArray(_ref, 2),
		    key = _ref2[0],
		    value = _ref2[1];

		if (value) {
			var encoded = window.encodeURIComponent(value);
			return key + '=' + encoded;
		}

		return '';
	}).filter(function (param) {
		return !!param;
	}).join('&');

	if (querystring.length > 0) {
		return '?' + querystring;
	}

	return '';
};

var openWindow = function openWindow(href) {
	var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var querystring = generateQuerystring(params);
	var name = options.name,
	    invisible = options.invisible;


	if (invisible) {
		window.location = '' + href + querystring;
		return;
	}

	var width = options.width,
	    height = options.height;


	width = width || 560;
	height = height || 420;

	var x = Math.round((window.innerWidth - width) / 2);
	var y = Math.round((window.innerHeight - height) / 2);

	var popup = window.open('' + href + querystring, name, 'width=' + width + ', height=' + height + ', left=' + x + ', top=' + y);

	if (typeof popup.focus === 'function') {
		popup.focus();
	}
};

var share = {
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				this.elements = {};

				this.elements.facebook = this.el.getElementsByClassName('js-share-facebook').item(0);
				this.elements.twitter = this.el.getElementsByClassName('js-share-twitter').item(0);
				this.elements.pinterest = this.el.getElementsByClassName('js-share-pinterest').item(0);
				this.elements.mail = this.el.getElementsByClassName('js-share-mail').item(0);
				this.elements.linkedin = this.el.getElementsByClassName('js-share-linkedin').item(0);

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.elements.facebook) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnFacebook();
					}, this.elements.facebook);
				}

				if (this.elements.twitter) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnTwitter();
					}, this.elements.twitter);
				}

				if (this.elements.pinterest) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnPinterest();
					}, this.elements.pinterest);
				}

				if (this.elements.mail) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareViaMail();
					}, this.elements.mail);
				}

				if (this.elements.linkedin) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnLinkedIn();
					}, this.elements.linkedin);
				}

				return this;
			}
		}, {
			key: 'shareOnFacebook',
			value: function shareOnFacebook() {
				var values = getMetaValues(document.head, '[property^="og:"]');

				var params = {
					u: values.url || this.url,
					title: values.title || this.title,
					caption: values.site_name,
					description: values.description || this.description
				};

				var isAbsoluteUrl = /^(https?:)?\/\//i;

				if (isAbsoluteUrl.test(values.image)) {
					params.picture = values.image;
				}

				openWindow('https://www.facebook.com/sharer.php', params, { name: 'Share on Facebook', width: 560, height: 630 });
			}
		}, {
			key: 'shareOnPinterest',
			value: function shareOnPinterest() {
				var values = getMetaValues(document.head, '[property^="og:"]');

				var params = {
					url: values.url || this.url,
					description: values.description || this.description,
					toolbar: 'no',
					media: values.image
				};

				openWindow('https://www.pinterest.com/pin/create/button', params, { name: 'Share on Pinterest', width: 740, height: 700 });
			}
		}, {
			key: 'shareOnTwitter',
			value: function shareOnTwitter() {
				var values = getMetaValues(document.head, '[name^="twitter:"]');

				var params = {
					url: values.url || this.url,
					text: values.title || this.title,
					via: values.site ? values.site.replace('@', '') : undefined
				};

				openWindow('https://twitter.com/intent/tweet', params, { name: 'Share on Twitter', width: 580, height: 253 });
			}
		}, {
			key: 'shareViaMail',
			value: function shareViaMail() {
				var params = {
					subject: this.title,
					body: this.title + ' (' + this.url + ') - ' + this.description
				};

				openWindow('mailto:', params, { invisible: true });
			}
		}, {
			key: 'shareOnLinkedIn',
			value: function shareOnLinkedIn() {
				var values = getMetaValues(document.head, '[property^="og:"]');

				var params = {
					url: values.url || this.url,
					mini: true,
					title: values.title || this.title,
					summary: values.description || this.description,
					source: values.url || this.url
				};

				openWindow('https://www.linkedin.com/shareArticle', params, { name: 'Share on LinkedIn', width: 740, height: 475 });
			}
		}, {
			key: 'title',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-title');
				var fallback = document.title;
				return attribute || fallback;
			}
		}, {
			key: 'description',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-description');
				var fallback = '';

				var tag = document.head.querySelector('meta[name="description"');

				if (tag) {
					fallback = tag.getAttribute('content');
				}

				return attribute || fallback;
			}
		}, {
			key: 'url',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-url');
				var fallback = window.location.href;

				var tag = document.head.querySelector('link[rel="canonical"]');

				if (tag) {
					fallback = tag.getAttribute('href');
				}

				return attribute || fallback;
			}
		}]);
		return controller;
	}(BaseController)
};

var smoothState = {
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
				this.replaceState(window.location.href, document.title);

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

				this.on('click a:not(.js-mr-smooth-state-disable):not([href^="http"]):not([href^="#"])', function (e, target) {
					// Avoid cross-origin calls
					if (!target.hostname || target.hostname !== window.location.hostname) {
						return;
					}

					var href = target.getAttribute('href');

					if (!href) {
						console.warn('Click on link without href');
						return;
					}

					e.preventDefault();
					e.stopPropagation();

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
						fetch(href, { credentials: 'include' }).then(function (res) {
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
				if (this.path.length > 0) {
					return this.path[this.path.length - 1];
				}

				return undefined;
			}
		}]);
		return controller;
	}(BaseController)
};

var timeAgo = {
	attributes: ['datetime'],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'resolve',
			value: function resolve() {
				// No need to wait for window.onload
				return Promise.resolve(true);
			}
		}, {
			key: 'init',
			value: function init() {
				this.translations = {
					ago: 'ago',
					year: ['year', 'years'],
					month: ['month', 'months'],
					week: ['week', 'weeks'],
					day: ['day', 'days'],
					hour: ['hour', 'hours'],
					minute: ['minute', 'minutes'],
					second: ['second', 'seconds']
				};
			}
		}, {
			key: 'getCountedNoun',
			value: function getCountedNoun(key) {
				var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

				if (!this.translations[key]) {
					return false;
				}

				if (typeof this.translations[key] === 'string') {
					return this.translations[key];
				}

				if (count === 1) {
					return this.translations[key][0];
				}

				return this.translations[key][1];
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				var makeReadable = function makeReadable(datetime) {
					var date = new Date(datetime);
					var time = date.getTime();
					var now = new Date();
					var calculated = void 0;

					if (!Number.isNaN(time)) {
						var diff = Math.floor(now.getTime() - time);

						calculated = {};
						calculated.seconds = Math.round(diff / 1000);
						calculated.minutes = Math.round(calculated.seconds / 60);
						calculated.hours = Math.round(calculated.minutes / 60);
						calculated.days = Math.round(calculated.hours / 24);
						calculated.weeks = Math.round(calculated.days / 7);
						calculated.months = Math.round(calculated.weeks / 4);
						calculated.years = Math.round(calculated.months / 12);
					}

					if (calculated) {
						if (calculated.months > 12) {
							var years = _this2.getCountedNoun('year', calculated.years);
							return calculated.years + ' ' + years + ' ' + _this2.translations.ago;
						} else if (calculated.weeks > 7) {
							var months = _this2.getCountedNoun('month', calculated.months);
							return calculated.months + ' ' + months + ' ' + _this2.translations.ago;
						} else if (calculated.days > 21) {
							var weeks = _this2.getCountedNoun('week', calculated.weeks);
							return calculated.weeks + ' ' + weeks + ' ' + _this2.translations.ago;
						} else if (calculated.hours > 24) {
							var days = _this2.getCountedNoun('day', calculated.days);
							return calculated.days + ' ' + days + ' ' + _this2.translations.ago;
						} else if (calculated.minutes > 60) {
							var hours = _this2.getCountedNoun('hour', calculated.hours);
							return calculated.hours + ' ' + hours + ' ' + _this2.translations.ago;
						} else if (calculated.seconds > 60) {
							var minutes = _this2.getCountedNoun('minute', calculated.minutes);
							return calculated.minutes + ' ' + minutes + ' ' + _this2.translations.ago;
						}

						var seconds = _this2.getCountedNoun('second', calculated.seconds);
						return calculated.seconds + ' ' + seconds + ' ' + _this2.translations.ago;
					}

					// Do nothing if we can't calculate a time diff
					return _this2.el.textContent;
				};

				this.el.textContent = makeReadable(this.datetime);

				return this;
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
		var parsed = to && to.toString ? to.toString() : undefined;
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, parsed);
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
		var parsed = typeof to === 'string' || !!to;
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, '');
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
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

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
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn('Could not set ' + attribute + ' to ' + to);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateJSONAttributeMethods = function generateJSONAttributeMethods(attribute) {
	// @param value  Whatever you want to parse
	// @param strict If true, return null when non-JSON parsed
	//               If false, return whatever was passed to parse
	var parse = function parse(value) {
		var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (typeof value === 'string') {
			try {
				var decoded = JSON.parse(value);

				if (decoded) {
					return decoded;
				}
			} catch (e) {
				return strict ? null : value;
			}

			return strict ? null : value;
		}

		return strict ? null : value;
	};

	var getter = function getter() {
		var value = this.el.getAttribute(attribute);

		return parse(value, true);
	};

	var setter = function setter(to) {
		if (!to) {
			this.el.removeAttribute(attribute);
			return;
		}

		var encoded = JSON.stringify(parse(to));
		var oldValue = this.el.getAttribute(attribute);

		if (encoded === oldValue) {
			return;
		}

		if (encoded) {
			this.el.setAttribute(attribute, encoded);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateAttributeMethods = function generateAttributeMethods(attribute) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'string';

	if (type === 'bool' || type === 'boolean') {
		return generateBoolAttributeMethods(attribute);
	} else if (type === 'int' || type === 'integer') {
		return generateIntegerAttributeMethods(attribute);
	} else if (type === 'float' || type === 'number') {
		return generateNumberAttributeMethods(attribute);
	} else if (type === 'string') {
		return generateStringAttributeMethods(attribute);
	} else if (type === 'json') {
		return generateJSONAttributeMethods(attribute);
	}

	return { getter: noop, setter: noop };
};

var CONTROLLER = Symbol('controller');

var registerElement = function registerElement(tag, options) {
	var observedAttributes = options.observedAttributes || [];

	customElements.define(tag, function (_HTMLElement) {
		inherits(_class, _HTMLElement);
		createClass(_class, [{
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attribute, oldValue, newValue) {
				if (oldValue === newValue) {
					return;
				}

				if (!this[CONTROLLER]) {
					return;
				}

				var propertyName = convertAttributeToPropertyName(attribute);

				var prototype = Object.getPrototypeOf(this[CONTROLLER]);
				var descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

				if (descriptor && descriptor.set) {
					this[CONTROLLER][propertyName] = newValue;
				}

				// If for argument `current` the method
				// `currentChangedCallback` exists, trigger
				var callback = this[CONTROLLER][propertyName + 'ChangedCallback'];

				if (typeof callback === 'function') {
					callback.call(this[CONTROLLER], oldValue, newValue);
				}
			}
		}], [{
			key: 'observedAttributes',
			get: function get$$1() {
				return observedAttributes;
			}
		}]);

		function _class() {
			classCallCheck(this, _class);

			var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

			observedAttributes.forEach(function (attribute) {
				if (typeof _this[attribute] !== 'undefined') {
					console.warn('Requested syncing on attribute \'' + attribute + '\' that already has defined behavior');
				}

				Object.defineProperty(_this, attribute, {
					configurable: false,
					enumerable: false,
					get: function get$$1() {
						return _this[CONTROLLER][attribute];
					},
					set: function set$$1(to) {
						_this[CONTROLLER][attribute] = to;
					}
				});
			});
			return _this;
		}

		createClass(_class, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this[CONTROLLER] = new options.controller(this);
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				if (typeof this[CONTROLLER].unbind === 'function') {
					this[CONTROLLER].unbind();
				}

				if (typeof this[CONTROLLER].destroy === 'function') {
					this[CONTROLLER].destroy();
				}

				this[CONTROLLER] = null;
			}
		}]);
		return _class;
	}(HTMLElement));
};

var registerAttribute = function registerAttribute() {
	var handlers = [];

	var observer = new MutationObserver(function (records) {
		var mutations = Array.from(records);

		mutations.forEach(function (mutation) {
			handlers.forEach(function (handler) {
				return handler(mutation);
			});
			return mutation;
		});
	});

	return function register(attribute) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		waitForDOMReady().then(function () {
			var extend = options.extends || HTMLElement;

			var nodeIsSupported = function nodeIsSupported(node) {
				if (Array.isArray(extend)) {
					return extend.some(function (supported) {
						return node instanceof supported;
					});
				}

				return node instanceof extend;
			};

			var attach = function attach(node) {
				var el = node;
				el[CONTROLLER] = new options.controller(el);
				return el;
			};

			var detach = function detach(node) {
				var el = node;

				if (el[CONTROLLER]) {
					el[CONTROLLER].destroy();
					el[CONTROLLER] = null;
				}

				return el;
			};

			// Setup observers
			handlers.push(function (mutation) {
				if (mutation.type === 'attributes' && nodeIsSupported(mutation.target)) {
					// Attribute changed on supported DOM node type
					var node = mutation.target;

					if (node.hasAttribute(attribute)) {
						attach(node);
					} else {
						detach(node);
					}
				} else if (mutation.type === 'childList') {
					// Handle added nodes
					if (mutation.addedNodes) {
						var addedNodes = Array.from(mutation.addedNodes);

						addedNodes.forEach(function (node) {
							if (nodeIsSupported(node) && node.hasAttribute(attribute)) {
								attach(node);
							}

							if (node.hasChildNodes()) {
								var nested = Array.from(node.querySelectorAll('[' + attribute + ']')).filter(function (nestedNode) {
									return nodeIsSupported(nestedNode);
								});

								if (nested && nested.length > 0) {
									nested.forEach(function (nestedNode) {
										attach(nestedNode);
									});
								}
							}
						});
					}

					if (mutation.removedNodes) {
						var removedNodes = Array.from(mutation.removedNodes);

						removedNodes.forEach(function (node) {
							// Clean up if the DOM node gets removed before the
							// attribute mutation has triggered
							if (nodeIsSupported(node) && node.hasAttribute(attribute)) {
								detach(node);
							}

							if (node.hasChildNodes()) {
								var nested = Array.from(node.querySelectorAll('[' + attribute + ']')).filter(function (nestedNode) {
									return nodeIsSupported(nestedNode);
								});

								if (nested && nested.length > 0) {
									nested.forEach(function (nestedNode) {
										detach(nestedNode);
									});
								}
							}
						});
					}
				}
			});

			observer.observe(document.body, {
				attributes: true,
				subtree: true,
				childList: true,
				attributeFilter: [attribute]
			});

			// Look for current on DOM ready
			Array.from(document.body.querySelectorAll('[' + attribute + ']'), function (el) {
				if (!nodeIsSupported(el)) {
					console.warn('Custom attribute', attribute, 'added on non-supported element');
					return false;
				}

				if (el[CONTROLLER]) {
					return el;
				}

				return attach(el);
			});
		});
	};
}();

var addAttributesToController = function addAttributesToController(controller) {
	var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return attributes.map(function (attribute) {
		// String, sync with actual element attribute
		if (typeof attribute === 'string') {
			var _generateAttributeMet = generateAttributeMethods(attribute, 'string'),
			    getter = _generateAttributeMet.getter,
			    setter = _generateAttributeMet.setter;

			addProperty(controller, attribute, getter, setter);
			return attribute;
		}

		if ((typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) === 'object') {
			var type = attribute.type || 'string';
			var name = attribute.attribute;

			var _generateAttributeMet2 = generateAttributeMethods(name, type),
			    _getter = _generateAttributeMet2.getter,
			    _setter = _generateAttributeMet2.setter;

			addProperty(controller, name, _getter, _setter);
			return name;
		}

		if (typeof attribute.attachTo === 'function') {
			var _name = attribute.attachTo(controller);

			if (_name) {
				return _name;
			}

			return false;
		}

		return false;
	}).filter(function (attribute) {
		return !!attribute;
	});
};

function defineCustomElement(tag) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	console.log('defining custom element: ' + JSON.strinify(tag));

	// Validate tag
	var isValidTag = tag.split('-').length > 1;

	// Validate type
	var type = ['element', 'attribute'].includes(options.type) ? options.type : 'element';

	if (type === 'element' && !isValidTag) {
		console.warn(tag, 'is not a valid Custom Element name. Register as an attribute instead.');
		return false;
	}

	// Validate attributes
	var attributes = Array.isArray(options.attributes) ? options.attributes : [];

	// Validate controller
	var controller = options.controller,
	    extend = options.extends;


	if (type === 'element' && extend) {
		console.warn('`extends` is not supported on element-registered Custom Elements. Register as an attribute instead.');
		return false;
	}

	var observedAttributes = addAttributesToController(controller, attributes);

	var validatedOptions = {
		type: type, extends: extend, attributes: attributes, controller: controller, observedAttributes: observedAttributes
	};

	if (type === 'attribute') {
		return registerAttribute(tag, validatedOptions);
	}

	return registerElement(tag, validatedOptions);
}

var Template = function () {
	function Template(selector) {
		var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
		classCallCheck(this, Template);

		this.template = scope.querySelector('template' + selector);
	}

	createClass(Template, [{
		key: 'render',
		value: function render() {
			var _this = this;

			var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (!this.template.content) {
				this.template.content = document.createDocumentFragment();

				var childNodes = Array.from(this.template.childNodes);

				childNodes.forEach(function (childNode) {
					_this.template.content.appendChild(childNode);
				});
			}

			var fragment = this.template.content.cloneNode(true);

			Object.entries(values).forEach(function (_ref) {
				var _ref2 = slicedToArray(_ref, 2),
				    selector = _ref2[0],
				    value = _ref2[1];

				try {
					var part = fragment.querySelector(selector);

					if (part) {
						if (typeof value === 'string') {
							part.textContent = value;
						} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value)) {
							Object.entries(value).forEach(function (_ref3) {
								var _ref4 = slicedToArray(_ref3, 2),
								    attribute = _ref4[0],
								    v = _ref4[1];

								if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && !Array.isArray(value)) {
									Object.assign(part[attribute], v);
								} else {
									Object.assign(part, defineProperty({}, attribute, v));
								}
							}, {});
						}
					}
				} catch (e) {
					console.warn('Invalid template replacement for selector `' + selector + '`');
				}
			});

			return fragment;
		}
	}]);
	return Template;
}();

// Base Controller

exports.BaseController = BaseController;
exports.media = AttrMedia;
exports.touchHover = AttrTouchHover;
exports.ajaxForm = ajaxForm;
exports.keyTrigger = keyTrigger;
exports.overlay = overlay;
exports.share = share;
exports.smoothState = smoothState;
exports.timeAgo = timeAgo;
exports.defineCustomElement = defineCustomElement;
exports.parseEvent = parse;
exports.getEventPath = getPath;
exports.parseHTML = parseHTML;
exports.renderNodes = renderNodes;
exports.cleanNodes = cleanNodes;
exports.promisify = promisify;
exports.Template = Template;
