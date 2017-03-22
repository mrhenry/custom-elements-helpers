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

export const parseHTML = (function parseHTML() {
	const parser = new DOMParser();
	return function parse(html, selector = null) {
		const parsed = parser.parseFromString(html, 'text/html');

		// Get document title
		const title = parsed.title;

		// Get document nodes
		const container = (selector) ? parsed.body.getElementsByTagName(selector) : parsed.body;

		if (container.length === 0) {
			throw new Error('not-found');
		}

		const content = container[0];

		// Get document meta
		const meta = Array.from(parsed.head.querySelectorAll('meta'), (tag) => parseMetaTag(tag)).filter((t) => !!t);

		return { title, content, meta };
	};
}());

export function renderNodes(content, container) {
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild);
	}

	for (let i = content.children.length - 1; i >= 0; i -= 1) {
		const child = content.children[i];

		if (container.firstChild) {
			container.insertBefore(child, container.firstChild);
		} else {
			container.appendChild(child);
		}
	}
}