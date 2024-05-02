import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, readItems, rest, staticToken, updateItem } from '@directus/sdk'
import { initiated } from '../utils/discord';

import { EmbedBuilder } from 'discord.js';


export default defineCronHandler('everyMinute', async () => {
  if (!initiated.value) return

  const config = useRuntimeConfig()

  const db = createDirectus(config.directusUrl)
    .with(staticToken(config.directusToken))
    .with(rest());

  const news = await db.request(readItems('news'))

  for (let n of news) {
    if (n.sent_to_discord) continue
    let embed = new EmbedBuilder().setTitle(n?.title)
    discord.channels.cache.get(config.discordNewsChannel).send({ embeds: [embed] })
    await db.request(updateItem('news', n?.id, {
      sent_to_discord: true
    }))
    console.log('sent ', n.title)
  }

}, { runOnInit: true })

