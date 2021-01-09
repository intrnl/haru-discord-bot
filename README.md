# Haru Discord bot

A Discord bot, using Discord's new [Interactions API][1] to allow for hosting on
serverless functions such as [Cloudflare Workers][2]

## To-dos

- Figure out the legality of hosting a bot like this on Cloudflare Workers
  - With signature verification, it takes around 55 ms to 160 ms for each
    request. Let alone the free tier, this is way beyond the "allowed" CPU time
    for the paid Bundled tier.
  - Without signature verification, it takes around 5 ms, making it doable, but
    given that it is a "requirement" according to Discord API docs, let's just
    hope that Discord devs would change their minds anytime soon.


[1]: https://github.com/discord/discord-api-docs/blob/feature/interactions/docs/interactions/Slash_Commands.md
[2]: https://workers.cloudflare.com/
