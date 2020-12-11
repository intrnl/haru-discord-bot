export function parseOptions (interaction) {
	let { data } = interaction;
	let map = { _: [data.name] };

	walk(data.options);
	return map;

	function walk (opts) {
		for (let { name, value, options } of opts) {
			if (options) {
				map._.push(name);
				walk(options);
			} else {
				map[name] = value;
			}
		}
	}
}
