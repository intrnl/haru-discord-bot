# Haru Discord bot

A Discord bot, using Discord's new [Interactions API][1] to allow for hosting on
serverless functions such as [Cloudflare Workers][2]

## To-dos

- Figure out the legality of hosting a bot like this on Cloudflare Workers
  - With signature verification, it takes up to 160 ms for each request. Let
    alone the free tier, this is way beyond the "allowed" CPU time for the paid
    Bundled tier. I had assumed that it would just kill the worker if it goes
    beyond the allowed time, but this hasn't happened.
  - Without signature verification, it takes around 5 ms, making it doable, but
    given that it is a "requirement" according to Discord API docs, let's just
    hope that Discord devs would change their minds anytime soon.

![Historical graph for CPU time](https://cdn.discordapp.com/attachments/335095954082365441/787006742621454357/unknown.png)

[1]: https://github.com/discord/discord-api-docs/blob/feature/interactions/docs/interactions/Slash_Commands.md
[2]: https://workers.cloudflare.com/
