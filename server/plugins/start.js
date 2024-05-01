export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  client.on('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  })

  client.login(config.discordBotToken);

  client.on('messageCreate', m => {
    console.log(m.content)
    if (m.author.bot) return
    if (m.content == 'hello bot') {
      m.reply('hey')
    }
  })


  // import { Collection, Events, Routes } from "discord.js";
  // import { SlashCommandBuilder } from 'discord.js'
  // import { REST, } from 'discord.js'

  // export const testCommand = {
  //   data: new SlashCommandBuilder()
  //     .setName('ping')
  //     .setDescription('Replies with pong'),
  //   async execute(interaction) {
  //     await interaction.reply(`PONG! This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
  //   },
  // };

  // const rest = new REST().setToken(config.discordBotToken);

  // await rest.put(
  //   Routes.applicationCommands(config.discordClientId),
  //   { body: [testCommand.data.toJSON()] },
  // );

  // client.commands = new Collection()

  // client.commands.set(testCommand.data.name, testCommand)

  // client.on(Events.InteractionCreate, async interaction => {
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
