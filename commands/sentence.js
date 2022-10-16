const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { main_color } = require('../config.js');

module.exports = {
  run: async (client, interaction) => {
    let language = interaction.options?.getString('language');

    await interaction.deferReply();
    
    await axios.request({
      method: 'GET',
      url: 'https://binubuo.p.rapidapi.com/generator/text/sentence',
      params: {rows: '1'},
      headers: {
        'X-RapidAPI-Key': process.env.RapidAPI_Key,
        'X-RapidAPI-Host': 'binubuo.p.rapidapi.com'
      }
    }).then(async resp => {
      if (language === 'en') {
        let embed = new EmbedBuilder()
          .setColor(main_color)
          .setTitle('Sentence')
          .setDescription(`*"${resp.data.Sentence[0]['R_SENTENCE']}"*`)
          .setFooter({ text: client.user.username, iconURL: `${client.user.avatarURL()}?size=2048` })
          .setTimestamp();
  
        await interaction.editReply({ embeds: [embed] });
      } else if (language !== 'en') {
        const params = new URLSearchParams();
        params.append("q", resp.data.Sentence[0]['R_SENTENCE']);
        params.append("target", language);
        
        await axios.request({
          method: 'POST',
          url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2/',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': process.env.RapidAPI_Key,
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
          },
          data: params
        }).then(async translated => {
          let translated_text = translated.data.data.translations[0]['translatedText'];

          let embed = new EmbedBuilder()
            .setColor(main_color)
            .setTitle('Sentence')
            .setDescription(`*"${translated_text}"*`)
            .setFooter({ text: client.user.username, iconURL: `${client.user.avatarURL()}?size=2048` })
            .setTimestamp();
  
          await interaction.editReply({ embeds: [embed] });
        }).catch(async () => {
          await interaction.editReply({ content: 'An error occurred while fetching your sentence.', ephemeral: true });
        });
      };
    }).catch(resp => {
      console.log(resp)
      interaction.editReply({ content: 'An error occurred while fetching your sentence.', ephemeral: true });
    })
  }
};