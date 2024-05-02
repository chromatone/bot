import { Client, IntentsBitField } from 'discord.js'
import { ref } from 'vue'

export const initiated = ref(false)

export const discord = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

