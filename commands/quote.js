const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { main_color } = require('../config.js');

module.exports = {
  run: async (client, interaction) => {
    let language = interaction.options?.getString('language');

    await axios.request({
      method: 'GET',
      url: 'https://quotes15.p.rapidapi.com/quotes/random/',
      params: { language_code: language === null ? 'en' : language },
      headers: {
        'X-RapidAPI-Key': process.env.RapidAPI_Key,
        'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
      }
    }).then(async resp => {
      let embed = new EmbedBuilder()
        .setColor(main_color)
        .setTitle('Quote')
        .setDescription(`*"${resp.data.content}"*`)
        .setFooter({ text: `Quote by ${resp.data.originator.name}`, iconURL: `${client.user.avatarURL()}?size=2048` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }).catch(async () => {
      await interaction.reply({ content: 'An error occurred while fetching your quote.', ephemeral: true });
    })
  }
};