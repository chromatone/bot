import { Collection, Events } from 'discord.js'
import test_message from '../commands/test-message.js'

let init

export default defineEventHandler((event) => {
  if (!init) {
    client.once(Events.ClientReady, readyClient => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);

      client.commands = new Collection();

      client.commands.set(test_message.data.name, test_message)

      client.on(Events.InteractionCreate, interaction => {
        console.log(interaction);
      });
    });

    client.login(process.env.NUXT_DISCORD_BOT_TOKEN);

    console.log('prepared')
    init = true
  }

})