/* eslint no-nested-ternary: 0 */

export default function(propertyName, json) {
	return json.sort((a, b) => {
		return a[propertyName] < b[propertyName]
			? -1
			: a[propertyName] > b[propertyName] ? 1 : 0;
	});
}
