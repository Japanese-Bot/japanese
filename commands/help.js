const { ActionRowBuilder, ButtonBuilder, ButtonStyle, OAuth2Scopes, EmbedBuilder } = require('discord.js');
const { main_color } = require('../config.js');

module.exports = {
  run: async (client, interaction) => {
    let invite = client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    });
    
    let buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`${client.user.username} | Invite Me`)
          .setStyle(ButtonStyle.Link)
          .setURL(invite)
      );
    let embed = new EmbedBuilder()
      .setColor(main_color)
      .setTitle(client.user.username)
      .setDescription(`**${client.user.username}** is an all-in-one translation bot for translating japanese and 100+ other languages. You may also generate random sentences and more!
      
      **${client.user.username}'s Commands:**
      \`/help\` - Helpful information regarding ${client.user.username}.
      \`/translate\` - Translate from 100+ different languages.
      \`/sentence\` - Generate a random sentence from 100+ languages.
      \`/quote\` - Generate a random quote from 100+ languages.`)
      .setThumbnail(`${client.user.avatarURL()}?size=2048`)
      .setFooter({ text: client.user.username, iconURL: `${client.user.avatarURL()}?size=2048` })
      .setTimestamp();
    
    return interaction.reply({ embeds: [embed], components: [buttons] });
  }
};