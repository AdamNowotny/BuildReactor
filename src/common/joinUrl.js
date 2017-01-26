/* eslint no-param-reassign: 0 */
export default function(root, path) {
	let fullRoot = root;
	if (path && path.startsWith('/')) {
		path = path.substring(1, path.length);
	}
	if (path && !root.endsWith('/')) {
		fullRoot += '/';
	}
	return fullRoot + path;
}
