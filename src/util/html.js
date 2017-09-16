export const parseMetaTag = (function parseMetaTag() {
	const blacklist = ['viewport'];

	return function parse(tag) {
		const name = tag.getAttribute('name');
		const property = tag.getAttribute('property');
		const content = tag.getAttribute('content');

		if (!name && !property) {
			return false;
		}

		if (blacklist.includes(name)) {
			return false;
		}

		return { name, property, content };
	};
}());

export function parseLinkTag(tag) {
	const rel = tag.getAttribute('rel');
	const href = tag.getAttribute('href');

	return { rel, href };
}

export const parseHTML = (function parseHTML() {
	const parser = new DOMParser();

	return function parse(html, selector = null) {
		const parsed = parser.parseFromString(html, 'text/html');

		// Get document title
		const title = parsed.title;

		// Get document nodes
		let content = parsed.body;

		if (selector) {
			content = parsed.body.querySelector(selector);

			if (!content) {
				throw new Error('not-found');
			}
		}

		// Get document meta
		const meta = Array.from(parsed.head.querySelectorAll('meta'), (tag) => parseMetaTag(tag)).filter((t) => !!t);

		// Get document links
		const links = Array.from(parsed.head.querySelectorAll('link[rel]'), (tag) => parseLinkTag(tag));

		return { title, content, meta, links };
	};
}());

export function renderNodes(content, container) {
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild);
	}

	for (let i = content.children.length - 1; i >= 0; i -= 1) {
		const child = content.children[i];

		Array.from(content.getElementsByTagName('img'), (img) => {
			const clone = document.createElement('img');
			clone.src = img.src;
			clone.sizes = img.sizes;
			clone.srcset = img.srcset;
			clone.className = img.className;

			if (img.getAttribute('width')) {
				clone.width = img.width;
			}

			if (img.getAttribute('height')) {
				clone.height = img.height;
			}

			img.parentNode.replaceChild(clone, img);

			return clone;
		});

		if (container.firstChild) {
			container.insertBefore(child, container.firstChild);
		} else {
			container.appendChild(child);
		}
	}
}

export function cleanNodes(nodes, selector) {
	if (!selector || (Array.isArray(selector) && selector.length === 0)) {
		return nodes;
	}

	const stringSelector = Array.isArray(selector) ? selector.join(', ') : selector;

	const bloat = Array.from(nodes.querySelectorAll(stringSelector));

	bloat.forEach((node) => node.parentNode.removeChild(node));

	return nodes;
}
