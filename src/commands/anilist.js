import { define } from '../lib/handler';
import { parseOptions } from '../lib/utils';


let url = 'https://graphql.anilist.co';
let headers = [
	['user-agent', 'github:intrnl/haru-discord-bot'],
	['content-type', 'application/json'],
	['accept', 'application/json'],
];

let mediaQuery = `
	query ($query: String!, $type: MediaType!) {
		result: Media (type: $type, search: $query) {
			url: siteUrl
			cover: coverImage { large }
			title { romaji native english }
			description
		}
	}
`;

let userQuery = `
	query ($user: String!) {
	  result: User (search: $user) {
	    url: siteUrl
	    name
	    avatar { large }
	    statistics {
	      anime { count episodesWatched }
	      manga { count chaptersRead }
	    }
	  }
	}
`;


define('anilist', (interaction) => {
	let opts = parseOptions(interaction);
	let type = opts._[1].toUpperCase();

	if (type == 'ANIME' || type == 'MANGA') {
		let query = opts.query;

		return fetch(url, {
			method: 'post',
			headers,
			body: JSON.stringify({ query: mediaQuery, variables: { type, query } }),
		})
			.then((response) => response.json())
			.then(({ data, errors }) => {
				if (errors?.length) {
					let error = errors[0];
					return 'AniList error - ' + error.message;
				}

				if (!data) {
					return 'Unknown error - Check back later.';
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
	} else if (type == 'USER') {
		let user = opts.user;

		return fetch(url, {
			method: 'post',
			headers,
			body: JSON.stringify({ query: userQuery, variables: { user } }),
		})
			.then((response) => response.json())
			.then(({ data, errors }) => {
				if (errors?.length) {
					let error = errors[0];
					return 'AniList error - ' + error.message;
				}

				if (!data) {
					return 'Unknown error - Check back later.';
				}

				let { result } = data;
				let { anime, manga } = data.statistics;

				return {
					embeds: [
						{
							author: { name: 'AniList', url: 'https://anilist.co' },
							title: result.name,
							description: [
								anime.count && `${anime.count} anime watched`,
								anime.episodesWatched && `${anime.episodesWatched} episodes watched`,
								manga.count && `${manga.count} manga read`,
								manga.chaptersRead && `${manga.chaptersRead} chapters read`,
							].join('\n'),
							thumbnail: { url: result.cover.large },
						},
					],
				};
			});
	}
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
