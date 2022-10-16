const { Client, GatewayIntentBits, ActivityType, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const { readdir, stat } = require('fs');
const { join } = require('path');
const { token, whitelisted, slash_commands } = require('./config.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ]});
const app = express();
const port = 3000;

client.slashCommands = new Collection();
client.slashCommandList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
});

readdir(join(__dirname, './commands/'), async (err, files) => {
  let commands = [];
  if (err) return console.log('An error occured when checking the types folder for types to load: ' + err);
  files.forEach(async (file) => {
    if (!file.endsWith('.js')) return;
    
    let run = require(`./commands/${file}`);
    client.slashCommandList.push(file);
    client.slashCommands.set(file.split('.')[0], run);
  });
});

client.once('ready', () => {
  client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.LISTENING }], status: 'online' });

  client.application.commands.fetch().then(commands => {
    client.slashCommandList.forEach(async (file) => {
      if (!file.endsWith('.js')) return;
      if (!commands.find(c => c.name === file.split('.')[0])) {
        let cmd = slash_commands.find(c => c.name === file.split('.')[0]);
        if (!cmd) return;

        await client.application.commands.create({
          'name': file.split('.')[0],
          'description': cmd.description === undefined ? 'No Description' : cmd.description,
          'type': cmd.type === undefined ? 1 : cmd.type,
          'options': cmd.options === undefined ? [] : cmd.options,
        });
      } else if (commands.find(c => c.name === file.split('.')[0])) {
        let cmd = slash_commands.find(c => c.name === file.split('.')[0]);
        if (!cmd) return await client.application.commands.delete(commands.find(c => c.name === file.split('.')[0]));

        cmd.type = cmd.type === undefined ? 1 : cmd.type;
        cmd.options = cmd.options === undefined ? [] : cmd.options;

        let slash = commands.find(c => c.name === file.split('.')[0]);
        let syntax = {
          'name': file.split('.')[0],
          'description': slash.description,
          'type': slash.type,
          'options': slash.options
        };
        
        let update = false;
        if (JSON.stringify(syntax) !== JSON.stringify(cmd)) update = true;
        
        if (update === true) {
          await client.application.commands.edit(commands.find(c => c.name === file.split('.')[0]), cmd);
          console.log('Updated Slash Command');
        };
      };
    });
    console.log('Loaded Slash Commands');
  });

  console.log(`Ready as ${client.user.username}#${client.user.discriminator}`);
});

client.on('interactionCreate', async interaction => {
  if (!whitelisted.includes(interaction.member.id)) return await interaction.reply({ content: 'You\'re not whitelisted for this command!', ephemeral: true });

  if (interaction.isChatInputCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
  
    try {
      command.run(client, interaction);
    } catch (e) {
      console.error(e)
    };
  } else if (interaction.isButton()) {
    if (interaction.customId === 'correct' || interaction.customId === 'issue') {
      if (interaction.member.user.id !== interaction.message.interaction.user.id) return interaction.reply({ content: 'You cannot submit feedback for translations you did not request.', ephemeral: true });

      let disabled_buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('correct')
          .setLabel(`Correct!`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('issue')
          .setLabel(`There's an issue!`)
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      await interaction.deferUpdate();
      await interaction.editReply({ components: [disabled_buttons] });
      
      await interaction.followUp({ content: 'Thanks! Your feedback has been sent to the team for review.', ephemeral: true });
    };
  };
});

app.listen(port, () => {
  client.login(token);
  console.log(`Example app listening on port ${port}`);
});