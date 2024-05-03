import { createDirectus, rest, staticToken, readItems, updateItem } from '@directus/sdk';
import { initiated, discord } from '../utils/discord';
// import { Collection, Events, Routes } from "discord.js";
// import { SlashCommandBuilder } from 'discord.js'
// import { REST, } from 'discord.js'

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  discord.on('ready', c => {
    initiated.value = true
    console.log(`Ready! Logged in as ${c.user.tag}`);
    // discord.channels.cache.get(config.discordNewsChannel).send('Bot loaded')
  })

  discord.login(config.discordBotToken);

  discord.on('messageCreate', m => {
    if (m.author.bot) return
    if (m.content == 'hello bot') {
      m.reply('hey')
    }
  })

  // ACTIVATE USER -> STUDENT
  discord.on('messageCreate', async (message) => {
    if (message.guild != config.discordGuildId) return
    if (message.author.bot) return
    if (message.channelId != config.discordActivationChannel) return
    if (!message.content.toLowerCase().startsWith('activate ')) return

    const db = createDirectus(config.directusUrl)
      .with(staticToken(config.directusToken))
      .with(rest())

    const member = await db.request(readItems('members', {
      fields: ['id', 'user.first_name'],
      filter: {
        discord_secret: {
          _eq: message.content.split(' ')?.[1]
        }
      }
    }))

    if (member.length == 0) {
      message.react('🛑')
      return
    }

    message.react('👍')

    const role = await message.guild.roles.fetch(config.discordRoleId)

    await message.member.roles.add(role)

    await db.request(updateItem('members', member[0].id, {
      discord_user: message.author.id,
      discord_username: message.author.username,
      discord_secret: null
    }))

    await message.reply(`Great news! We got a new community member - @${message.author.username}! You can now enjoy full access to the server channels.`);
    await message.delete()

  });


  // const testCommand = {
  //   data: new SlashCommandBuilder()
  //     .setName('ping')
  //     .setDescription('Replies with pong'),
  //   async execute(interaction) {
  //     await interaction.reply(`PONG! This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
  //   },
  // };

  // const restClient = new REST().setToken(config.discordBotToken);

  // let res = await restClient.put(
  //   Routes.applicationCommands(config.discordClientId),
  //   { body: [testCommand.data.toJSON()] },
  // );

  // console.log('cleint', res)

  // discord.commands = new Collection()

  // discord.commands.set(testCommand.data.name, testCommand)

  // discord.on(Events.InteractionCreate, async interaction => {
  //   if (!interaction.isChatInputCommand()) return;
  //   const command = interaction.client.commands.get(interaction.commandName);
  //   try {
  //     await command.execute(interaction);
  //   } catch (error) {
  //     console.error(error);
  //     if (interaction.replied || interaction.deferred) {
  //       await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
  //     } else {
  //       await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  //     }
  //   }
  // });

})










