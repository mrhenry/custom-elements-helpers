const parseResponse = function (res) {
	const data = (function parseResonseToData() {
		// Force lowercase keys
		if (typeof res === 'object') {
			return Object.entries(res).reduce((object, [key, value]) => {
				const lowercaseKey = key.toLowerCase();

				Object.assign(object, {
					[lowercaseKey]: value,
				});

				return object;
			}, {});
		}

		return res;
	}());

	const status = (function parseResponseToStatus() {
		if (data.status) {
			return parseInt(data.status, 10);
		}

		if (parseInt(data, 10).toString() === data.toString()) {
			return parseInt(data, 10);
		}

		return 200;
	}());

	return { status, data };
};

const fetchJSONP = function (url, paramKey = 'callback') {
	return new Promise((resolve, reject) => {
		// Register a global callback
		// Make sure we have a unique function name
		const now = (new Date()).getTime();
		const callback = `AJAX_FORM_CALLBACK_${now}`;

		window[callback] = (res) => {
			// Make the callback a noop
			// so it triggers only once (just in case)
			window[callback] = () => {};

			// Clean up after ourselves
			const script = document.getElementById(callback);
			script.parentNode.removeChild(script);

			const { status, data } = parseResponse(res);

			// If res is only a status code
			if (status >= 200 && status <= 399) {
				return resolve(data);
			}

			return reject(data);
		};

		const script = document.createElement('script');
		script.id = callback;
		script.src = `${url}&${paramKey}=${callback}`;
		document.head.appendChild(script);
	});
};

export default fetchJSONP;
