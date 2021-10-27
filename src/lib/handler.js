let encoder = new TextEncoder();
let commands = new Map();

export function define (name, handler) {
	commands.set(name, handler);
}


addEventListener('fetch', (event) => {
	event.respondWith(
		handleRequest(event.request)
			.catch((err = {}) => {
				let { name, message, stack } = err;
				console.log('error during request', { name, message, stack });

				return respond({
					status: 500,
					data: { message: 'Error during request', error: { name, message } },
				});
			})
	);
});


function respond ({ data, ...init }) {
	console.log('created response', { data, ...init });

	return new Response(JSON.stringify(data), init);
}

function reply (data = {}) {
	console.log('created reply', data);

	if (typeof data == 'string') {
		data = { content: data };
	}

	return respond({ status: 200, data: { type: 4, data } });
}

/**
 * @param {Request} request
 * @param {string} key
 */
async function handleRequest (request) {
	if (request.method != 'POST') {
		return respond({ status: 400, data: { message: 'Not implemented' } });
	}

	if (!request.headers.has('x-signature-ed25519') || !request.headers.has('x-signature-timestamp')) {
		return respond({ status: 401, data: { message: 'Missing signature headers' } });
	}


	let key = PUBLIC_KEY;
	let body = await request.text();
	let timestamp = request.headers.get('x-signature-timestamp');
	let signature = request.headers.get('x-signature-ed25519');

	let hash = encoder.encode(timestamp + body).buffer;
	let valid = await crypto.subtle.verify('node-ed25519', key, signature, hash);

	if (!valid) {
		return respond({ status: 401, data: { message: 'Invalid signature' } });
	}


	let interaction = JSON.parse(body);

	if (interaction.type == 1) {
		return respond({ status: 200, data: { type: 1 } });
	}

	if (interaction.type == 2) {
		let { name: command } = interaction.data;
		let handler = commands.get(command);

		if (!handler) {
			return reply('Invalid command');
		}

		return Promise.resolve(handler(interaction))
			.catch((err) => {
				let { name, message, stack } = err ?? {};
				console.error('error during command', { command, name, message, stack });

				return [
					`Error occured while processing \`${command}\``,
					'```',
					name ?? '<No name>',
					message ?? '<No message>',
					'```',
				].join('\n');
			})
			.then((response) => reply(response));
	}
}
