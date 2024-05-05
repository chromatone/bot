import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, readItems, rest, staticToken, updateItem } from '@directus/sdk'
import { initiated } from '../utils/discord';

export default defineCronHandler('everyTenMinutes', async () => {
  if (!initiated.value) return

  const config = useRuntimeConfig()

  const db = createDirectus(config.directusUrl)
    .with(staticToken(config.directusToken))
    .with(rest());

  const members = await db.request(readItems('members', {
    fields: ['id', 'active', 'discord_username', 'discord_user'],
    filter: {
      active: {
        _eq: false
      },
      discord_user: {
        _nempty: true
      },
      discord_active: {
        _eq: true
      }
    }
  }))

  for (let member of members) {
    let guild = discord.guilds.cache.get(config.discordGuildId)
    let mem = await guild.members.fetch(member?.discord_user)
    await mem.roles.remove(config.discordRoleId)

    await db.request(updateItem('members', member?.id, {
      discord_active: false
    }))

    console.log(`Removed inactive member: ${member?.discord_username}, ${member?.id}`)
  }


}, { runOnInit: true })

