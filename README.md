# Haru Discord bot

A Discord bot, using Discord's new [Interactions API][1] to allow for hosting on
serverless functions such as [Cloudflare Workers][2]

## To-dos

- Figure out the legality of hosting a bot like this on Cloudflare Workers
  - **Update 2: It's fine.**
    - Cloudflare Workers now has a [non-standard extension][4] to SubtleCrypto
      API adding support for ED25519, which should be faster than doing it via
      `noble-ed25519` package.
  - **Update 1: This is fine.**
    - It might be that the way the CPU time limit works is that it's not per
      request, but rather you have a giant pool to go through. Which for the
      free tier, it's 10 ms * 100,000 requests. (per day)
    - Alternatively, it's because the CPU time limit rolls over to the next
      request. Because some of the requests doesn't always reach 10 ms, it
      rolls over to the heavy requests.
      - This is in line with the [documentation regarding CPU time limit][3].
      - This might be more reasonable, but odd since the first request (on the
        next day, where the limit has been reset) would take 20-160 ms on
        average, so what is there to rollover?
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
[3]: https://developers.cloudflare.com/workers/learning/metrics-and-analytics#cpu-time
[4]: https://community.cloudflare.com/t/2021-6-25-workers-runtime-release-notes/281775
