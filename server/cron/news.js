import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, readItems, rest, staticToken, updateItem } from '@directus/sdk'
import { initiated } from '../utils/discord';

import { EmbedBuilder } from 'discord.js';


export default defineCronHandler('everyTenMinutes', async () => {
  if (!initiated.value) return

  const config = useRuntimeConfig()

  const db = createDirectus(config.directusUrl)
    .with(staticToken(config.directusToken))
    .with(rest());

  const news = await db.request(readItems('news', {
    filter: {
      sent_to_discord: {
        _eq: false
      }
    }
  }))

  for (let n of news) {

    const embed = new EmbedBuilder()
      .setTitle(n?.title)
      .setDescription(n?.description)
      .setURL(n?.link)
      .addFields({ name: 'Date', value: n?.date.slice(0, 10), inline: false })
      .setFooter({ text: 'Chromatone news' });

    if (n?.cover) {
      embed.setImage(`${config.directusUrl}/assets/${n?.cover}`)
    }


    discord.channels.cache.get(config.discordNewsChannel).send({ embeds: [embed] })
    await db.request(updateItem('news', n?.id, {
      sent_to_discord: true
    }))
    console.log('sent ', n.title)
  }

}, { runOnInit: true })

