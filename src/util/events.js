export function parse(name) {
	const clean = name.trim();
	const parts = clean.split(' ');

	let event = clean;
	let selector = null;

	if (parts.length > 1) {
		event = parts.shift();
		selector = parts.join(' ');
	}

	return { event, selector };
}

export function getPath(e) {
	let path = e.path;

	if (!path) {
		path = [e.target];
		let node = e.target;

		while (node.parentNode) {
			node = node.parentNode;
			path.push(node);
		}
	}

	return path;
}
