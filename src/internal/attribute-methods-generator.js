const noop = function () {};

const generateStringAttributeMethods = function (attribute) {
	const getter = function () {
		if (this.el.hasAttribute(attribute)) {
			return this.el.getAttribute(attribute);
		}

		return undefined;
	};

	const setter = function (to) {
		const parsed = to && to.toString ? to.toString() : undefined;
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, parsed);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateBoolAttributeMethods = function (attribute) {
	const getter = function () {
		return !!this.el.hasAttribute(attribute);
	};

	const setter = function (to) {
		const parsed = typeof to === 'string' || !!to;
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, '');
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateIntegerAttributeMethods = function (attribute) {
	const getter = function () {
		return parseInt(this.el.getAttribute(attribute), 10);
	};

	const setter = function (to) {
		const parsed = parseInt(to, 10);
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn(`Could not set ${attribute} to ${to}`);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateNumberAttributeMethods = function (attribute) {
	const getter = function () {
		return parseFloat(this.el.getAttribute(attribute));
	};

	const setter = function (to) {
		const parsed = parseFloat(to);
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn(`Could not set ${attribute} to ${to}`);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateJSONAttributeMethods = function (attribute) {
	// @param value  Whatever you want to parse
	// @param strict If true, return null when non-JSON parsed
	//               If false, return whatever was passed to parse
	const parse = function (value, strict = false) {
		if (typeof value === 'string') {
			try {
				const decoded = JSON.parse(value);

				if (decoded) {
					return decoded;
				}
			} catch (e) {
				return (strict) ? null : value;
			}

			return (strict) ? null : value;
		}

		return (strict) ? null : value;
	};

	const getter = function () {
		const value = this.el.getAttribute(attribute);

		return parse(value, true);
	};

	const setter = function (to) {
		if (!to) {
			this.el.removeAttribute(attribute);
			return;
		}

		const encoded = JSON.stringify(parse(to));
		const oldValue = this.el.getAttribute(attribute);

		if (encoded === oldValue) {
			return;
		}

		if (encoded) {
			this.el.setAttribute(attribute, encoded);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateAttributeMethods = function (attribute, type = 'string') {
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

export {
	generateBoolAttributeMethods,
	generateIntegerAttributeMethods,
	generateStringAttributeMethods,
	generateNumberAttributeMethods,
	generateAttributeMethods,
};
