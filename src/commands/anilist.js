import { define } from '../lib/handler';


let url = 'https://graphql.anilist.co';

let query = `
	query ($search: String!, $type: MediaType!) {
		result: Media (type: $type, search: $search) {
			url: siteUrl
			cover: coverImage { large }
			title { romaji native english }
			description
			score: averageScore
			episodes
			season
			seasonYear
		}
	}
`;


define('anilist', ({ data: { options } }) => {
	let { name: type } = options[0];
	let { value: search } = options[0].options[0];

	type = type.toUpperCase();

	return fetch(url, {
		method: 'post',
		headers: [
			['content-type', 'application/json'],
			['accept', 'application/json'],
		],
		body: JSON.stringify({ query, variables: { type, search } }),
	})
		.then((response) => response.json())
		.then(({ data, errors }) => {
			if (errors?.length) {
				let error = error[0];
				return error.message;
			}

			let { result } = data;

			return {
				embeds: [
					{
						author: { name: 'AniList', url: 'https://anilist.co' },
						title: result.title.english ?? result.title.romaji ?? result.title.native,
						description: trim(prune(result.description), 280),
						url: result.url,
						thumbnail: { url: result.cover.large },
					},
				],
			};
		});
});


function prune (str) {
	return str
		.replace(/<br>/i, '');
}

function trim (str, max) {
	return str.length > max
		? str.slice(0, max - 1) + '…'
		: str;
}
